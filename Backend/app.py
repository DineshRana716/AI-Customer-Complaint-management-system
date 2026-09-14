from dotenv import load_dotenv
from fastapi import FastAPI

from routers.complaints import router as complaints_router

load_dotenv()

app = FastAPI(title="AI Complaint System API")

app.include_router(complaints_router)


@app.get("/health")
def health():
    return {"status": "ok"}
