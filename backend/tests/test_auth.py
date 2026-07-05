"""Tests for the auth endpoints."""


def test_register_success(client):
    res = client.post(
        "/auth/register",
        json={"email": "new@test.dev", "password": "password123"},
    )
    assert res.status_code == 201
    body = res.json()
    assert body["email"] == "new@test.dev"
    assert "id" in body
    assert "hashed_password" not in body  # must never leak the hash


def test_register_duplicate_email(client):
    payload = {"email": "dup@test.dev", "password": "password123"}
    client.post("/auth/register", json=payload)
    res = client.post("/auth/register", json=payload)
    assert res.status_code == 400


def test_register_short_password(client):
    res = client.post(
        "/auth/register",
        json={"email": "x@test.dev", "password": "short"},
    )
    assert res.status_code == 422  # fails Pydantic validation


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"email": "log@test.dev", "password": "password123"},
    )
    res = client.post(
        "/auth/login",
        data={"username": "log@test.dev", "password": "password123"},
    )
    assert res.status_code == 200
    assert res.json()["token_type"] == "bearer"
    assert res.json()["access_token"]


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={"email": "wp@test.dev", "password": "password123"},
    )
    res = client.post(
        "/auth/login",
        data={"username": "wp@test.dev", "password": "WRONGpass1"},
    )
    assert res.status_code == 401


def test_me_requires_token(client, auth_headers):
    # Without a token -> 401.
    assert client.get("/auth/me").status_code == 401
    # With a token -> 200 and returns the user.
    res = client.get("/auth/me", headers=auth_headers)
    assert res.status_code == 200
    assert res.json()["email"] == "user@test.dev"
