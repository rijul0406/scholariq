"""Tests for goal CRUD and the completion toggle."""


def test_create_and_toggle_goal(client, auth_headers):
    created = client.post(
        "/goals",
        headers=auth_headers,
        json={"title": "Finish unit", "target_minutes": 300},
    )
    assert created.status_code == 201
    assert created.json()["is_completed"] is False

    gid = created.json()["id"]
    toggled = client.put(
        f"/goals/{gid}", headers=auth_headers, json={"is_completed": True}
    )
    assert toggled.status_code == 200
    assert toggled.json()["is_completed"] is True


def test_delete_goal(client, auth_headers):
    gid = client.post(
        "/goals",
        headers=auth_headers,
        json={"title": "Temp", "target_minutes": 60},
    ).json()["id"]
    assert client.delete(f"/goals/{gid}", headers=auth_headers).status_code == 204
    assert client.get("/goals", headers=auth_headers).json() == []


def test_goal_ownership(client, make_auth):
    alice = make_auth("alice@test.dev")
    bob = make_auth("bob@test.dev")
    gid = client.post(
        "/goals", headers=alice, json={"title": "A goal", "target_minutes": 60}
    ).json()["id"]
    assert client.delete(f"/goals/{gid}", headers=bob).status_code == 404
