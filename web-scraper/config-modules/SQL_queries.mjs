export let queries = {
  insert_artist: `Insert into artist (artist_name, artist_image_url, artist_description, artist_position) 
              values (@artist_name, @artist_image_url, @artist_description, @artist_position)`,
  check_duplicate_artist: `select * from artist
    where artist_name = @artist_name`,
  insert_category: `Insert into category (category_name, category_image_url, category_description) 
              values (@category_name, @category_image_url, @category_description)`,
  check_duplicate_category: `select * from category
    where category_name = @category_name`,
  insert_genre: `Insert into music_genre (genre_name, genre_image_url, genre_description) 
              values (@genre_name, @genre_image_url, @genre_description)`,
  check_duplicate_genre: `select * from music_genre
    where genre_name = @genre_name`,
  insert_event: `INSERT INTO music_concert_events (
                  event_title, artist_id, sub_artists, event_date, doors_open_time, event_start_time, 
                  event_address, event_venue, city, state, country, price, event_url, genre_id, category_id, 
                  event_image_url, event_description, language, featured
                  ) VALUES (
                  @event_title, @artist_id, @sub_artists, @event_date, @doors_open_time, @event_start_time, 
                  @event_address, @event_venue, @city, @state, @country, @price, @event_url, @genre_id, @category_id,
                  @event_image_url, @event_description, @language, @featured)`,
  check_duplicate_event: `select * from music_concert_events
    where event_title = @event_title`,
};
