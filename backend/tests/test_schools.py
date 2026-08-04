import pytest


@pytest.mark.asyncio
async def test_register_creates_school_and_returns_token(client, school_payload):
    response = await client.post('/api/schools/register', json=school_payload)
    assert response.status_code == 201

    body = response.json()
    assert body['access_token']
    assert body['school']['admin_email'] == school_payload['admin_email']
    assert body['school']['name'] == school_payload['name']
    # Auto-generated code should be letters + digits, e.g. "BKNPS482"
    assert body['school']['code']
    assert any(ch.isdigit() for ch in body['school']['code'])
    # Password must never leak back to the client.
    assert 'password' not in body['school']
    assert 'password_hash' not in body['school']


@pytest.mark.asyncio
async def test_register_rejects_duplicate_email(client, school_payload):
    first = await client.post('/api/schools/register', json=school_payload)
    assert first.status_code == 201

    second = await client.post('/api/schools/register', json=school_payload)
    assert second.status_code == 409


@pytest.mark.asyncio
async def test_login_with_correct_credentials_succeeds(client, school_payload):
    await client.post('/api/schools/register', json=school_payload)

    response = await client.post(
        '/api/schools/login',
        json={'admin_email': school_payload['admin_email'], 'password': school_payload['password']},
    )
    assert response.status_code == 200
    assert response.json()['access_token']


@pytest.mark.asyncio
async def test_login_with_wrong_password_fails(client, school_payload):
    await client.post('/api/schools/register', json=school_payload)

    response = await client.post(
        '/api/schools/login',
        json={'admin_email': school_payload['admin_email'], 'password': 'wrong-password'},
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_me_requires_a_valid_token(client, school_payload):
    no_auth = await client.get('/api/schools/me')
    assert no_auth.status_code == 403  # HTTPBearer with no header

    bad_auth = await client.get('/api/schools/me', headers={'Authorization': 'Bearer not-a-real-token'})
    assert bad_auth.status_code == 401


@pytest.mark.asyncio
async def test_me_returns_the_authenticated_schools_profile(client, school_payload):
    register_response = await client.post('/api/schools/register', json=school_payload)
    token = register_response.json()['access_token']

    response = await client.get('/api/schools/me', headers={'Authorization': f'Bearer {token}'})
    assert response.status_code == 200
    assert response.json()['admin_email'] == school_payload['admin_email']


@pytest.mark.asyncio
async def test_logo_upload_sets_logo_url(client, school_payload):
    register_response = await client.post('/api/schools/register', json=school_payload)
    token = register_response.json()['access_token']

    files = {'file': ('logo.png', b'\x89PNG\r\n\x1a\n fake png bytes', 'image/png')}
    response = await client.post(
        '/api/schools/me/logo',
        headers={'Authorization': f'Bearer {token}'},
        files=files,
    )
    assert response.status_code == 200
    body = response.json()
    assert body['logo_url'] is not None
    assert body['logo_url'].startswith('/uploads/logos/')
