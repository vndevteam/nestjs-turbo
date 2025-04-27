export enum ConstraintErrors {
  UQ_user_username = 'app.common.error.unique_username',
  UQ_user_email = 'app.common.error.unique_email',
  UQ_user_follows_follower_id_followee_id = 'app.common.error.unique_follow',
  UQ_tag_name = 'app.common.error.unique_tag',
  UQ_user_favorites_user_id_article_id = 'app.common.error.unique_favorite',
  UQ_article_slug = 'app.common.error.unique_slug',
}
