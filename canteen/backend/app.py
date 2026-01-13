from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
from sqlalchemy import create_engine, Column, String, Integer, Boolean, Text
from sqlalchemy.orm import declarative_base, sessionmaker
import os
import uuid
import time

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
DB_PATH = os.path.join(os.path.dirname(__file__), "data.db")

os.makedirs(UPLOAD_DIR, exist_ok=True)

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_DIR
CORS(app, resources={r"/api/*": {"origins": "*"}})

engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, future=True)
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class MealModel(Base):
    __tablename__ = "meals"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    highlights = Column(Text)
    serving = Column(String, nullable=False)
    active = Column(Boolean, nullable=False, default=True)
    image_path = Column(String)
    created_at = Column(Integer, nullable=False)
    updated_at = Column(Integer, nullable=False)


Base.metadata.create_all(bind=engine)


def to_dict(m: MealModel):
    image_url = None
    if m.image_path:
        image_url = f"/uploads/{os.path.basename(m.image_path)}"
    return {
        "id": m.id,
        "name": m.name,
        "category": m.category,
        "description": m.description,
        "highlights": m.highlights or "",
        "serving": m.serving,
        "active": bool(m.active),
        "image_url": image_url,
        "created_at": m.created_at,
        "updated_at": m.updated_at,
    }


@app.get("/api/meals")
def list_meals():
    with SessionLocal() as s:
        meals = s.query(MealModel).order_by(MealModel.created_at.desc()).all()
        return jsonify([to_dict(m) for m in meals])


@app.get("/api/meals/<mid>")
def get_meal(mid: str):
    with SessionLocal() as s:
        m = s.query(MealModel).filter(MealModel.id == mid).first()
        if not m:
            return jsonify({"error": "not_found"}), 404
        return jsonify(to_dict(m))


@app.post("/api/meals")
def create_meal():
    now = int(time.time() * 1000)
    name = request.form.get("name", "").strip()
    category = request.form.get("category", "").strip()
    description = request.form.get("description", "").strip()
    highlights = request.form.get("highlights", "").strip()
    serving = request.form.get("serving", "").strip()
    active_raw = request.form.get("active", "true").strip().lower()
    active = active_raw in ("true", "1", "yes")
    image = request.files.get("image")

    if not name or not description or not category or not serving:
        return jsonify({"error": "invalid_input"}), 400

    img_path = None
    if image:
        filename = secure_filename(image.filename or f"{uuid.uuid4()}.bin")
        filename = f"{uuid.uuid4()}_{filename}"
        dst = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        image.save(dst)
        img_path = dst

    record = MealModel(
        id=str(uuid.uuid4()),
        name=name,
        category=category,
        description=description,
        highlights=highlights,
        serving=serving,
        active=active,
        image_path=img_path,
        created_at=now,
        updated_at=now,
    )
    with SessionLocal() as s:
        s.add(record)
        s.commit()
    return jsonify(to_dict(record)), 201


@app.put("/api/meals/<mid>")
def update_meal(mid: str):
    payload = request.get_json(silent=True) or {}
    with SessionLocal() as s:
        m = s.query(MealModel).filter(MealModel.id == mid).first()
        if not m:
            return jsonify({"error": "not_found"}), 404
        if "name" in payload:
            m.name = str(payload["name"]).strip()
        if "category" in payload:
            m.category = str(payload["category"]).strip()
        if "description" in payload:
            m.description = str(payload["description"]).strip()
        if "highlights" in payload:
            m.highlights = str(payload["highlights"]).strip()
        if "serving" in payload:
            m.serving = str(payload["serving"]).strip()
        if "active" in payload:
            m.active = bool(payload["active"])
        m.updated_at = int(time.time() * 1000)
        s.commit()
        s.refresh(m)
        return jsonify(to_dict(m))


@app.delete("/api/meals/<mid>")
def delete_meal(mid: str):
    with SessionLocal() as s:
        m = s.query(MealModel).filter(MealModel.id == mid).first()
        if not m:
            return jsonify({"error": "not_found"}), 404
        img_path = m.image_path
        s.delete(m)
        s.commit()
    if img_path and os.path.isfile(img_path):
        try:
            os.remove(img_path)
        except Exception:
            pass
    return jsonify({"ok": True})


@app.get("/uploads/<path:filename>")
def serve_upload(filename: str):
    return send_from_directory(app.config["UPLOAD_FOLDER"], filename)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
