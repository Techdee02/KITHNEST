import pytest


async def _register(client, school_payload):
    response = await client.post('/api/schools/register', json=school_payload)
    body = response.json()
    return body['access_token'], body['school']['code']


@pytest.mark.asyncio
async def test_admin_can_post_an_update(client, school_payload):
    token, _ = await _register(client, school_payload)

    response = await client.post(
        '/api/schools/me/updates',
        headers={'Authorization': f'Bearer {token}'},
        json={'title': 'PTA meeting Saturday', 'body': 'Holds at 10am in the school hall.', 'category': 'reminder'},
    )
    assert response.status_code == 201
    body = response.json()
    assert body['title'] == 'PTA meeting Saturday'
    assert body['category'] == 'reminder'
    assert body['channel'] == 'app'  # default


@pytest.mark.asyncio
async def test_posting_an_update_requires_auth(client):
    response = await client.post(
        '/api/schools/me/updates',
        json={'title': 'Unauthorized post', 'body': 'Should not work.'},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_lookup_by_code_returns_public_school_info(client, school_payload):
    _, code = await _register(client, school_payload)

    response = await client.get(f'/api/schools/lookup/{code}')
    assert response.status_code == 200
    body = response.json()
    assert body['name'] == school_payload['name']
    assert body['code'] == code
    # Public lookup must never leak admin credentials.
    assert 'admin_email' not in body
    assert 'password_hash' not in body


@pytest.mark.asyncio
async def test_lookup_by_code_is_case_insensitive(client, school_payload):
    _, code = await _register(client, school_payload)

    response = await client.get(f'/api/schools/lookup/{code.lower()}')
    assert response.status_code == 200


@pytest.mark.asyncio
async def test_lookup_unknown_code_returns_404(client):
    response = await client.get('/api/schools/lookup/NOPE999')
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_parent_can_see_updates_posted_by_that_schools_admin(client, school_payload):
    token, code = await _register(client, school_payload)

    await client.post(
        '/api/schools/me/updates',
        headers={'Authorization': f'Bearer {token}'},
        json={'title': 'First update', 'body': 'Body one'},
    )
    await client.post(
        '/api/schools/me/updates',
        headers={'Authorization': f'Bearer {token}'},
        json={'title': 'Second update', 'body': 'Body two'},
    )

    response = await client.get(f'/api/schools/lookup/{code}/updates')
    assert response.status_code == 200
    body = response.json()
    assert len(body) == 2
    # Newest first.
    assert body[0]['title'] == 'Second update'
    assert body[1]['title'] == 'First update'


@pytest.mark.asyncio
async def test_updates_are_scoped_to_their_own_school(client, school_payload):
    token_a, code_a = await _register(client, school_payload)

    other_school = dict(school_payload)
    other_school['admin_email'] = 'other-admin@otherschool.ng'
    _, code_b = await _register(client, other_school)

    await client.post(
        '/api/schools/me/updates',
        headers={'Authorization': f'Bearer {token_a}'},
        json={'title': 'Only for school A', 'body': 'Body'},
    )

    response = await client.get(f'/api/schools/lookup/{code_b}/updates')
    assert response.status_code == 200
    assert response.json() == []
