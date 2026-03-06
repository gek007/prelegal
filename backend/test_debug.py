import os
print("Current directory:", os.getcwd())
print("Backend file:", os.path.abspath(__file__))
print("Backend dir:", os.path.dirname(os.path.abspath(__file__)))
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
templates_dir = os.path.join(BACKEND_DIR, "templates")
print("Templates dir:", templates_dir)
print("Templates exists:", os.path.exists(templates_dir))
if os.path.exists(templates_dir):
    print("Templates:", os.listdir(templates_dir)[:5])
