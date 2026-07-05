"""Tests for the analytics aggregation."""


def test_summary_empty(client, auth_headers):
    """A brand-new user has zeroed-out stats (no crash on empty data)."""
    res = client.get("/analytics/summary", headers=auth_headers)
    assert res.status_code == 200
    body = res.json()
    assert body["total_minutes"] == 0
    assert body["session_count"] == 0
    assert body["by_subject"] == []


def test_summary_aggregation(client, auth_headers):
    # Two Calculus sessions (45 + 30) and one Physics (60).
    for subject, minutes in [("Calculus", 45), ("Calculus", 30), ("Physics", 60)]:
        client.post(
            "/sessions",
            headers=auth_headers,
            json={"subject": subject, "duration_minutes": minutes},
        )
    # One goal, marked complete.
    gid = client.post(
        "/goals", headers=auth_headers, json={"title": "G", "target_minutes": 100}
    ).json()["id"]
    client.put(f"/goals/{gid}", headers=auth_headers, json={"is_completed": True})

    body = client.get("/analytics/summary", headers=auth_headers).json()

    assert body["total_minutes"] == 135
    assert body["session_count"] == 3
    assert body["goals_total"] == 1
    assert body["goals_completed"] == 1

    # by_subject is ordered by most-studied first.
    by_subject = {row["subject"]: row["total_minutes"] for row in body["by_subject"]}
    assert by_subject == {"Calculus": 75, "Physics": 60}
    assert body["by_subject"][0]["subject"] == "Calculus"
