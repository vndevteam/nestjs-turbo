export enum ErrorCode {
  // Common Validation
  V000 = 'app.common.validation.error',

  // Validation
  V001 = 'app.common.validation.is_empty',
  V002 = 'app.common.validation.is_invalid',

  // Error
  E001 = 'app.user.username_or_email_exists',
  E002 = 'app.user.not_found',
  E101 = 'app.profile.not_found',
  E102 = 'app.profile.following_self',
  E103 = 'app.profile.already_followed',
  E104 = 'app.profile.not_followed',
  E201 = 'app.article.not_found',
  E301 = 'app.comment.not_found',
  E302 = 'app.comment.not_authorized_to_delete',
}
