SELECT
    profiles.username,
    profiles.id,
    messages.content,
    messages.created_at,
    chat_rooms.id as chat_room_id,
    profiles.avatar_url
FROM profiles
    INNER JOIN chat_rooms_profiles ON profiles.id = chat_rooms_profiles.user_id
    INNER JOIN chat_rooms ON chat_rooms_profiles.room_id = chat_rooms.id
    INNER JOIN messages on messages.id = chat_rooms.last_message_id
WHERE room_id IN (
        SELECT room_id
        FROM chat_rooms_profiles
        WHERE
            user_id = '85c1cb3d-64d4-49c5-8861-abf9c57b54e1'
    )
ORDER BY messages.created_at DESC