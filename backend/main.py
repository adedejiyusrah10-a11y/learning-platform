from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import List, Optional
from datetime import timedelta, datetime
import os

from database import get_db, User, Course, Lesson, Enrollment, Quiz, QuizQuestion, QuizAttempt, Note, Review
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash, ACCESS_TOKEN_EXPIRE_MINUTES

app = FastAPI(title="Lumora API")

app.add_middleware(
    CORSMiddleware,
   allow_origins=os.environ.get("CORS_ORIGINS", "http://localhost:5173,http://localhost:5174,http://localhost:5175").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    is_instructor: bool = False

class LessonResponse(BaseModel):
    id: int
    title: str
    duration: str
    order: int
    content: str
    video_url: Optional[str] = None

class CourseResponse(BaseModel):
    id: int
    title: str
    description: str
    instructor: str
    category: str
    image_url: Optional[str] = None
    duration: str
    level: str
    lessons: List[LessonResponse] = []

class EnrollmentResponse(BaseModel):
    id: int
    progress: int = 0
    course: CourseResponse

class ProgressUpdate(BaseModel):
    lesson_id: int
    completed: bool

class NoteCreate(BaseModel):
    content: str

    class Config:
        json_schema_extra = {
            "example": {"content": "Key takeaway: Python variables are dynamically typed."}
        }

@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, hashed_password=hashed_password, full_name=user.full_name)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "full_name": new_user.full_name, "is_instructor": new_user.is_instructor}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"access_token": access_token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name}}

@app.get("/courses")
def get_courses(category: Optional[str] = None, search: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(Course).options(joinedload(Course.lessons))
    if category:
        query = query.filter(Course.category == category)
    if search:
        query = query.filter(Course.title.contains(search) | Course.description.contains(search))
    return query.all()

@app.get("/courses/{course_id}")
def get_course(course_id: int, db: Session = Depends(get_db)):
    course = db.query(Course).options(joinedload(Course.lessons)).filter(Course.id == course_id).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return course

@app.get("/categories")
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(Course.category).distinct().all()
    return [cat[0] for cat in categories]

@app.post("/enroll/{course_id}")
def enroll(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Enrollment).filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already enrolled")
    enrollment = Enrollment(user_id=current_user.id, course_id=course_id)
    db.add(enrollment)
    db.commit()
    return {"message": "Enrolled successfully"}

@app.get("/my-courses")
def get_my_courses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollments = db.query(Enrollment).options(joinedload(Enrollment.course).joinedload(Course.lessons)).filter(Enrollment.user_id == current_user.id).all()
    return enrollments

@app.post("/progress/{course_id}")
def update_progress(course_id: int, progress: ProgressUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id).first()
    if not enrollment:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    completed = [int(x) for x in enrollment.completed_lessons.split(",") if x] if enrollment.completed_lessons else []
    if progress.completed and progress.lesson_id not in completed:
        completed.append(progress.lesson_id)
    elif not progress.completed and progress.lesson_id in completed:
        completed.remove(progress.lesson_id)
    enrollment.completed_lessons = ",".join(str(x) for x in completed)
    course = db.query(Course).filter(Course.id == course_id).first()
    total_lessons = len(course.lessons)
    enrollment.progress = int((len(completed) / total_lessons) * 100) if total_lessons > 0 else 0
    db.commit()
    return {"progress": enrollment.progress, "completed_lessons": completed}

@app.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "email": current_user.email, "full_name": current_user.full_name, "is_instructor": current_user.is_instructor}

@app.put("/me")
def update_me(data: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.full_name = data.full_name
    if data.email != current_user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
        current_user.email = data.email
    if data.password:
        current_user.hashed_password = get_password_hash(data.password)
    db.commit()
    return {"id": current_user.id, "email": current_user.email, "full_name": current_user.full_name, "is_instructor": current_user.is_instructor}

@app.get("/notes/{lesson_id}")
def get_notes(lesson_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    note = db.query(Note).filter(Note.lesson_id == lesson_id, Note.user_id == current_user.id).first()
    return note

@app.post("/notes/{lesson_id}")
def save_note(lesson_id: int, data: NoteCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not data.content.strip():
        raise HTTPException(status_code=400, detail="Note cannot be empty")
    note = db.query(Note).filter(Note.lesson_id == lesson_id, Note.user_id == current_user.id).first()
    if note:
        note.content = data.content
    else:
        note = Note(user_id=current_user.id, lesson_id=lesson_id, content=data.content)
        db.add(note)
    db.commit()
    db.refresh(note)
    return note

class ReviewCreate(BaseModel):
    rating: int
    comment: str = ""

class UserUpdate(BaseModel):
    email: str
    full_name: str
    password: str = ""

class CourseCreate(BaseModel):
    title: str
    description: str
    category: str
    image_url: Optional[str] = ""
    duration: str
    level: str
    lessons: List[dict] = []

@app.get("/courses/{course_id}/reviews")
def get_reviews(course_id: int, db: Session = Depends(get_db)):
    reviews = db.query(Review).filter(Review.course_id == course_id).all()
    result = []
    for r in reviews:
        user = db.query(User).filter(User.id == r.user_id).first()
        result.append({"id": r.id, "user_name": user.full_name if user else "Unknown", "rating": r.rating, "comment": r.comment, "created_at": r.created_at})
    return result

@app.post("/courses/{course_id}/reviews")
def create_review(course_id: int, data: ReviewCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    existing = db.query(Review).filter(Review.user_id == current_user.id, Review.course_id == course_id).first()
    if existing:
        existing.rating = data.rating
        existing.comment = data.comment
    else:
        review = Review(user_id=current_user.id, course_id=course_id, rating=data.rating, comment=data.comment)
        db.add(review)
    db.commit()
    return {"message": "Review saved"}

@app.get("/certificate/{course_id}")
def get_certificate(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    enrollment = db.query(Enrollment).filter(Enrollment.user_id == current_user.id, Enrollment.course_id == course_id).first()
    if not enrollment or enrollment.progress < 100:
        raise HTTPException(status_code=400, detail="Course not completed")
    course = db.query(Course).filter(Course.id == course_id).first()
    html = f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Certificate</title>
<style>
  body {{ font-family: 'Georgia', serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; background: #f5f5f5; }}
  .cert {{ width: 800px; padding: 60px; background: white; border: 15px solid #1e40af; text-align: center; }}
  h1 {{ font-size: 14px; color: #1e40af; letter-spacing: 4px; text-transform: uppercase; }}
  h2 {{ font-size: 48px; color: #1e40af; margin: 20px 0; }}
  .name {{ font-size: 36px; font-weight: bold; color: #111827; margin: 30px 0; }}
  .course {{ font-size: 24px; color: #374151; }}
  .date {{ font-size: 14px; color: #6b7280; margin-top: 40px; }}
  .seal {{ width: 80px; height: 80px; border-radius: 50%; background: #1e40af; color: white; display: flex; align-items: center; justify-content: center; font-size: 36px; margin: 30px auto; }}
</style></head><body>
<div class="cert">
  <h1>Certificate of Completion</h1>
  <h2>Lumora</h2>
  <div class="seal">&#10003;</div>
  <p style="font-size:18px;color:#6b7280;">This certifies that</p>
  <div class="name">{current_user.full_name}</div>
  <p style="font-size:18px;color:#6b7280;">has successfully completed the course</p>
  <div class="course">{course.title}</div>
  <div class="date">Completed on {datetime.utcnow().strftime('%B %d, %Y')}</div>
</div></body></html>"""
    from fastapi.responses import HTMLResponse
    return HTMLResponse(html)

@app.get("/courses/{course_id}/quizzes")
def get_quizzes(course_id: int, db: Session = Depends(get_db)):
    quizzes = db.query(Quiz).options(joinedload(Quiz.questions)).filter(Quiz.course_id == course_id).all()
    return quizzes

@app.post("/quizzes/{quiz_id}/submit")
def submit_quiz(quiz_id: int, answers: list[int], current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    
    questions = db.query(QuizQuestion).filter(QuizQuestion.quiz_id == quiz_id).all()
    correct = 0
    for i, question in enumerate(questions):
        if i < len(answers) and answers[i] == question.correct_answer:
            correct += 1
    
    attempt = QuizAttempt(
        user_id=current_user.id,
        quiz_id=quiz_id,
        score=correct,
        total_questions=len(questions)
    )
    db.add(attempt)
    db.commit()
    
    return {
        "score": correct,
        "total": len(questions),
        "percentage": int((correct / len(questions)) * 100) if questions else 0
    }

@app.get("/my-quiz-scores")
def get_my_scores(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == current_user.id).all()
    return attempts
@app.get("/instructor/courses")
def get_instructor_courses(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Instructor access required")
    courses = db.query(Course).options(joinedload(Course.lessons), joinedload(Course.quizzes).joinedload(Quiz.questions)).filter(Course.instructor == current_user.full_name).all()
    return courses

@app.post("/instructor/courses")
def create_instructor_course(data: CourseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Instructor access required")
    course = Course(title=data.title, description=data.description, instructor=current_user.full_name, category=data.category, image_url=data.image_url or "", duration=data.duration, level=data.level)
    db.add(course)
    db.flush()
    for i, lesson_data in enumerate(data.lessons):
        lesson = Lesson(course_id=course.id, title=lesson_data.get("title", ""), duration=lesson_data.get("duration", "30 min"), order=i+1, content=lesson_data.get("content", ""), video_url=lesson_data.get("video_url", ""))
        db.add(lesson)
    db.commit()
    return course

@app.put("/instructor/courses/{course_id}")
def update_instructor_course(course_id: int, data: CourseCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Instructor access required")
    course = db.query(Course).filter(Course.id == course_id, Course.instructor == current_user.full_name).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    course.title = data.title
    course.description = data.description
    course.category = data.category
    course.image_url = data.image_url or ""
    course.duration = data.duration
    course.level = data.level
    db.commit()
    return course

@app.delete("/instructor/courses/{course_id}")
def delete_instructor_course(course_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Instructor access required")
    course = db.query(Course).filter(Course.id == course_id, Course.instructor == current_user.full_name).first()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(course)
    db.commit()
    return {"message": "Course deleted"}

@app.get("/admin/users")
def admin_get_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Admin access required")
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "full_name": u.full_name, "is_instructor": u.is_instructor} for u in users]

@app.put("/admin/users/{user_id}")
def admin_update_user(user_id: int, data: UserCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not current_user.is_instructor:
        raise HTTPException(status_code=403, detail="Admin access required")
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.full_name = data.full_name
    if data.password:
        user.hashed_password = get_password_hash(data.password)
    db.commit()
    return {"message": "User updated"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))