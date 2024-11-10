export const validate = (schema, request) => {
  return schema.parse(request);
};
