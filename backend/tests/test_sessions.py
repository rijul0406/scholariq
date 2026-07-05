"""Tests for study session CRUD — including the ownership security check."""


def test_create_and_list_session(client, auth_headers):
    res = client.post(
        "/sessions",
        headers=auth_headers,
        json={"subject": "Calculus", "duration_minutes": 45},
    )
    assert res.status_code == 201
    assert res.json()["subject"] == "Calculus"

    listed = client.get("/sessions", headers=auth_headers)
    assert listed.status_code == 200
    assert len(listed.json()) == 1


def test_create_validation_rejects_bad_duration(client, auth_headers):
    res = client.post(
        "/sessions",
        headers=auth_headers,
        json={"subject": "Calculus", "duration_minutes": 0},  # must be > 0
    )
    assert res.status_code == 422


def test_delete_session(client, auth_headers):
    created = client.post(
        "/sessions",
        headers=auth_headers,
        json={"subject": "Physics", "duration_minutes": 30},
    ).json()
    res = client.delete(f"/sessions/{created['id']}", headers=auth_headers)
    assert res.status_code == 204
    assert client.get("/sessions", headers=auth_headers).json() == []


def test_requires_auth(client):
    assert client.get("/sessions").status_code == 401


def test_cannot_touch_another_users_session(client, make_auth):
    """The security guarantee: user B cannot see/edit/delete user A's session."""
    alice = make_auth("alice@test.dev")
    bob = make_auth("bob@test.dev")

    sid = client.post(
        "/sessions",
        headers=alice,
        json={"subject": "Secret", "duration_minutes": 10},
    ).json()["id"]

    # Bob's list doesn't include it.
    assert client.get("/sessions", headers=bob).json() == []
    # Bob can't update or delete it -> 404 (not even 403, so existence isn't leaked).
    assert (
        client.put(
            f"/sessions/{sid}", headers=bob, json={"subject": "hacked"}
        ).status_code
        == 404
    )
    assert client.delete(f"/sessions/{sid}", headers=bob).status_code == 404
    # Alice's session is untouched.
    assert client.get("/sessions", headers=alice).json()[0]["subject"] == "Secret"
