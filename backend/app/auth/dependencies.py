"""Auth dependencies: turn a request's JWT into the logged-in User.

Adding `current_user: User = Depends(get_current_user)` to any route makes that
route require a valid token, and hands the route the matching User object.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.auth.security import decode_access_token
from app.database import get_db
from app.models import User

# Tells FastAPI to look for "Authorization: Bearer <token>". tokenUrl points at
# our login route so the /docs "Authorize" button knows where to get a token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
) -> User:
    """Verify the token and return the User it belongs to, or 401 if invalid."""
    credentials_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(token)  # None if signature/expiry invalid
    if user_id is None:
        raise credentials_error

    user = db.get(User, int(user_id))
    if user is None:
        raise credentials_error

    return user
