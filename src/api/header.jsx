export function Headers (accessToken) {

  return { 'headers': { 'Authorization': `JWT ${accessToken}`} }
}

export function RequestHeaders(request, accessToken) {
  return { 'headers': { 'X-Request-Id': `${request}`, 'Authorization': `Bearer ${accessToken}` } };
}