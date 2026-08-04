from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.routers import ai, schools, updates

app = FastAPI(title='Kithnest API')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.mount('/uploads', StaticFiles(directory=settings.upload_dir), name='uploads')

app.include_router(schools.router, prefix='/api')
app.include_router(updates.router, prefix='/api')
app.include_router(ai.router, prefix='/api')


@app.get('/api/health')
async def health():
    return {'status': 'ok'}
