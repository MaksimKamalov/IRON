FROM python:3.10.7 as python

# Set environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    PYSETUP_PATH="/opt/pysetup" \
    VENV_PATH="/opt/pysetup/.venv"

ENV PATH="$VENV_PATH/bin:$PATH"

# Set the working directory to /opt/pysetup
WORKDIR $PYSETUP_PATH

# Set the working directory to /app/backend
WORKDIR /app/backend

# Copy the entire project to the working directory
COPY . /app/backend

# Install dependencies
RUN pip install -r requirements.txt

# Specify the command to run on container start
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
CMD daphne -b 0.0.0.0 -p 8000 iron_io.asgi:application
