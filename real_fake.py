import cv2
import mediapipe as mp
import numpy as np
import tensorflow as tf

# ------------------ TFLite Model ------------------
MODEL_PATH = "converted_models/Models/2.7_80x80_MiniFASNetV2.tflite"
interpreter = tf.lite.Interpreter(model_path=MODEL_PATH)
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

# ------------------ MediaPipe Face Detection ------------------
mp_face = mp.solutions.face_detection
face_detection = mp_face.FaceDetection(model_selection=0, min_detection_confidence=0.7)

# ------------------ Preprocess ------------------
def preprocess(face):
    face = cv2.resize(face, (80, 80))
    face = face.astype(np.float32) / 255.0
    return np.expand_dims(face, axis=0)

# ------------------ Predict Spoof ------------------
def predict_spoof(face):
    inp = preprocess(face)
    interpreter.set_tensor(input_details[0]['index'], inp)
    interpreter.invoke()
    out = interpreter.get_tensor(output_details[0]['index'])
    if out.shape[-1] == 2:
        fake_score, real_score = out[0]
    else:
        real_score = out[0][0]
        fake_score = 1 - real_score
    return real_score, fake_score

# ------------------ Camera ------------------
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    h, w, _ = frame.shape
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

    result = face_detection.process(rgb)

    status = "NO FACE"
    color = (0, 0, 255)

    if result.detections:
        for det in result.detections:
            box = det.location_data.relative_bounding_box
            x1 = int(box.xmin * w)
            y1 = int(box.ymin * h)
            x2 = int((box.xmin + box.width) * w)
            y2 = int((box.ymin + box.height) * h)

            x1, y1 = max(0, x1), max(0, y1)
            x2, y2 = min(w, x2), min(h, y2)

            face_crop = frame[y1:y2, x1:x2]
            if face_crop.size == 0:
                continue

            real, fake = predict_spoof(face_crop)

            if real > fake and real > 0.6:
                status = f"REAL ✅ ({real:.2f})"
                color = (0, 255, 0)
            else:
                status = f"SPOOF ❌ ({fake:.2f})"
                color = (0, 0, 255)

            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
            break

    cv2.putText(frame, status, (20, 40), cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
    cv2.imshow("SilentFace Anti-Spoof LIVE", frame)

    if cv2.waitKey(1) & 0xFF == 27:  # ESC
        break

cap.release()
cv2.destroyAllWindows()
