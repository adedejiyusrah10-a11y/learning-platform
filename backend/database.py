from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime

Base = declarative_base()
engine = create_engine("sqlite:///./learning.db", connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_instructor = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    enrollments = relationship("Enrollment", back_populates="user")

class Course(Base):
    __tablename__ = "courses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    instructor = Column(String)
    category = Column(String)
    image_url = Column(String, default="")
    duration = Column(String)
    level = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    lessons = relationship("Lesson", back_populates="course", cascade="all, delete-orphan")
    enrollments = relationship("Enrollment", back_populates="course")
    quizzes = relationship("Quiz", back_populates="course", cascade="all, delete-orphan")

class Lesson(Base):
    __tablename__ = "lessons"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    video_url = Column(String)
    duration = Column(String)
    order = Column(Integer)
    content = Column(Text)
    course = relationship("Course", back_populates="lessons")

class Enrollment(Base):
    __tablename__ = "enrollments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    progress = Column(Integer, default=0)
    completed_lessons = Column(String, default="")
    enrolled_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")

class Quiz(Base):
    __tablename__ = "quizzes"
    id = Column(Integer, primary_key=True, index=True)
    course_id = Column(Integer, ForeignKey("courses.id"))
    title = Column(String)
    questions = relationship("QuizQuestion", back_populates="quiz", cascade="all, delete-orphan")
    course = relationship("Course", back_populates="quizzes")

class QuizQuestion(Base):
    __tablename__ = "quiz_questions"
    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    question = Column(String)
    options = Column(String)
    correct_answer = Column(Integer)
    quiz = relationship("Quiz", back_populates="questions")

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    lesson_id = Column(Integer, ForeignKey("lessons.id"))
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    quiz_id = Column(Integer, ForeignKey("quizzes.id"))
    score = Column(Integer)
    total_questions = Column(Integer)
    completed_at = Column(DateTime, default=datetime.utcnow)

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey("courses.id"))
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def seed_data():
    db = SessionLocal()
    if db.query(Course).first():
        db.close()
        return
    
    courses = [
        Course(title="Python Fundamentals", description="Master Python from scratch.", instructor="Dr. Sarah Chen", category="Programming", duration="12 hours", level="Beginner", image_url="https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800"),
        Course(title="React & Modern Frontend", description="Build interactive UIs with React.", instructor="James Wilson", category="Web Development", duration="18 hours", level="Intermediate", image_url="https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800"),
        Course(title="Data Science with Python", description="Learn pandas, numpy, and ML basics.", instructor="Prof. Maria Garcia", category="Data Science", duration="24 hours", level="Advanced", image_url="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800"),
        Course(title="UI/UX Design Principles", description="Design beautiful interfaces.", instructor="Alex Thompson", category="Design", duration="10 hours", level="Beginner", image_url="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800"),
    ]
    
    lessons_by_course = {
        "Python Fundamentals": [
            Lesson(course_id=0, title="Introduction to Python", duration="15 min", order=1, content=f"""
                <h2>Welcome to Python!</h2>
                <p>Python is a powerful, easy-to-learn programming language created by Guido van Rossum.</p>
                <h3>What you'll learn:</h3>
                <ul><li>Variables and data types</li><li>Control flow</li><li>Functions</li></ul>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/kqtD5dpn9C8' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Variables and Data Types", duration="30 min", order=2, content=f"""
                <h2>Variables in Python</h2>
                <p>Variables are containers for storing data values.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>x = 5\ny = \"Hello, World!\"\nprint(x)\nprint(y)</pre>
                <h3>Data Types:</h3>
                <ul><li><strong>int</strong> - Integer</li><li><strong>float</strong> - Decimal</li><li><strong>str</strong> - String</li><li><strong>bool</strong> - Boolean</li></ul>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/hEgO047GxaQ' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Control Flow", duration="45 min", order=3, content=f"""
                <h2>If Statements and Loops</h2>
                <p>Control flow lets your program make decisions.</p>
                <h3>If Statement:</h3>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>age = 18\nif age >= 18:\n    print(\"Adult\")\nelse:\n    print(\"Minor\")</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/Zp5MuPOtsSY' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Functions", duration="40 min", order=4, content=f"""
                <h2>Functions in Python</h2>
                <p>Functions are reusable blocks of code.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>def greet(name):\n    return f\"Hello, {{name}}!\"\nprint(greet(\"Alice\"))</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/9Os0o3wzS_I' frameborder='0' allowfullscreen></iframe></div>
            """),
        ],
        "React & Modern Frontend": [
            Lesson(course_id=0, title="JSX and Components", duration="20 min", order=1, content=f"""
                <h2>JSX Fundamentals</h2>
                <p>JSX is a syntax extension for JavaScript that looks like HTML.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>const element = &lt;h1&gt;Hello, World!&lt;/h1&gt;;</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/DLW3eWYTGJQ' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="State and Props", duration="35 min", order=2, content=f"""
                <h2>State Management</h2>
                <p>State and props are how React manages data in components.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>const [count, setCount] = useState(0)</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/O6P86uwfdR0' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Hooks Deep Dive", duration="40 min", order=3, content=f"""
                <h2>React Hooks</h2>
                <p>Hooks let you use state and other React features without classes.</p>
                <h3>Common Hooks:</h3>
                <ul><li>useState</li><li>useEffect</li><li>useContext</li><li>useRef</li></ul>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/TNhaISOUy6Q' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="React Router", duration="25 min", order=4, content=f"""
                <h2>Client-Side Routing</h2>
                <p>React Router enables navigation between views in a React app.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>&lt;Route path='/courses' element={{&lt;Courses /&gt;}} /&gt;</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/Ul3y1LXx0UY' frameborder='0' allowfullscreen></iframe></div>
            """),
        ],
        "Data Science with Python": [
            Lesson(course_id=0, title="NumPy Basics", duration="30 min", order=1, content=f"""
                <h2>Introduction to NumPy</h2>
                <p>NumPy is the fundamental package for scientific computing in Python.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>import numpy as np\narr = np.array([1,2,3])</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/8Ykfc7mMVIY' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Pandas DataFrames", duration="45 min", order=2, content=f"""
                <h2>Data Manipulation with Pandas</h2>
                <p>Pandas provides high-performance data structures.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>import pandas as pd\ndf = pd.read_csv('data.csv')</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/vmEHCJofslg' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Data Visualization", duration="35 min", order=3, content=f"""
                <h2>Visualizing Data</h2>
                <p>Matplotlib and Seaborn for creating publication-quality plots.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>import matplotlib.pyplot as plt\nplt.plot(x, y)</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/r-uOLxNrNk8' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Machine Learning Intro", duration="50 min", order=4, content=f"""
                <h2>ML with scikit-learn</h2>
                <p>Build predictive models with scikit-learn.</p>
                <pre style='background:#f4f4f4;padding:10px;border-radius:5px;'>from sklearn.linear_model import LinearRegression\nmodel = LinearRegression()</pre>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/7eh4d6sabA0' frameborder='0' allowfullscreen></iframe></div>
            """),
        ],
        "UI/UX Design Principles": [
            Lesson(course_id=0, title="Design Thinking", duration="20 min", order=1, content=f"""
                <h2>Design Thinking Process</h2>
                <p>A human-centered approach to design with 5 phases: Empathize, Define, Ideate, Prototype, Test.</p>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/_r0VX-aU_T8' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Color Theory", duration="25 min", order=2, content=f"""
                <h2>Understanding Color</h2>
                <p>Color theory is a practical guide to creating visually pleasing designs.</p>
                <h3>Key Concepts:</h3>
                <ul><li>Color wheel</li><li>Complementary colors</li><li>Color psychology</li></ul>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/_2LLXnUdUIc' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Typography", duration="20 min", order=3, content=f"""
                <h2>Typography in Design</h2>
                <p>Typography is the art of arranging type to make written language legible and appealing.</p>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/sByzHoiIj2I' frameborder='0' allowfullscreen></iframe></div>
            """),
            Lesson(course_id=0, title="Wireframing", duration="30 min", order=4, content=f"""
                <h2>Creating Wireframes</h2>
                <p>Wireframes are low-fidelity layouts that show the structure of a page.</p>
                <div style="margin-top:20px"><iframe width='100%' height='400' src='https://www.youtube.com/embed/qpH7-K4-7Dc' frameborder='0' allowfullscreen></iframe></div>
            """),
        ],
    }

    for course in courses:
        db.add(course)
        db.flush()
        for lesson in lessons_by_course[course.title]:
            lesson.course_id = course.id
            db.add(lesson)

    quizzes_data = [
        Quiz(course_id=1, title="Python Basics Quiz"),
        Quiz(course_id=2, title="React Fundamentals Quiz"),
        Quiz(course_id=3, title="Data Science Quiz"),
        Quiz(course_id=4, title="UI/UX Design Quiz"),
    ]
    for quiz in quizzes_data:
        db.add(quiz)
        db.flush()

    quiz_questions = {
        1: [
            QuizQuestion(quiz_id=1, question="What is Python primarily used for?", options='["Web development", "Data analysis", "Both", "Neither"]', correct_answer=2),
            QuizQuestion(quiz_id=1, question="Which keyword defines a function in Python?", options='["func", "def", "function", "define"]', correct_answer=1),
            QuizQuestion(quiz_id=1, question="What data type is 'Hello'?", options='["int", "bool", "str", "list"]', correct_answer=2),
            QuizQuestion(quiz_id=1, question="Which loop repeats while a condition is true?", options='["for", "while", "do-while", "repeat"]', correct_answer=1),
        ],
        2: [
            QuizQuestion(quiz_id=2, question="What is JSX?", options='["A database", "A JS syntax extension", "A CSS framework", "A build tool"]', correct_answer=1),
            QuizQuestion(quiz_id=2, question="Which hook manages state?", options='["useEffect", "useState", "useRef", "useContext"]', correct_answer=1),
            QuizQuestion(quiz_id=2, question="What does React DOM use to update the UI?", options='["Virtual DOM", "Shadow DOM", "Real DOM", "DOM API"]', correct_answer=0),
            QuizQuestion(quiz_id=2, question="How do you pass data from parent to child?", options='["State", "Props", "Context", "Refs"]', correct_answer=1),
        ],
        3: [
            QuizQuestion(quiz_id=3, question="Which library provides DataFrames?", options='["NumPy", "Pandas", "Matplotlib", "Scikit-learn"]', correct_answer=1),
            QuizQuestion(quiz_id=3, question="What does NumPy provide?", options='["DataFrames", "Arrays", "Plots", "Models"]', correct_answer=1),
            QuizQuestion(quiz_id=3, question="Which library is used for plotting?", options='["Pandas", "NumPy", "Matplotlib", "Scipy"]', correct_answer=2),
            QuizQuestion(quiz_id=3, question="What type of learning uses labeled data?", options='["Unsupervised", "Supervised", "Reinforcement", "Transfer"]', correct_answer=1),
        ],
        4: [
            QuizQuestion(quiz_id=4, question="What is the first phase of Design Thinking?", options='["Ideate", "Prototype", "Empathize", "Test"]', correct_answer=2),
            QuizQuestion(quiz_id=4, question="Which colors are opposite on the color wheel?", options='["Analogous", "Complementary", "Triadic", "Monochromatic"]', correct_answer=1),
            QuizQuestion(quiz_id=4, question="What is a wireframe?", options='["Final design", "Low-fidelity layout", "Color palette", "Font set"]', correct_answer=1),
            QuizQuestion(quiz_id=4, question="What does UX stand for?", options='["User Experience", "User Extension", "Universal X", "Unified XML"]', correct_answer=0),
        ],
    }
    for qid, questions in quiz_questions.items():
        for q in questions:
            q.quiz_id = qid
            db.add(q)
    
    db.commit()
    db.close()

seed_data()