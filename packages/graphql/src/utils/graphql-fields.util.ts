import { GraphQLResolveInfo } from 'graphql';
import { parseResolveInfo } from 'graphql-parse-resolve-info';

export function getFieldNames(info: GraphQLResolveInfo): string[] {
  const parsedInfo = parseResolveInfo(info);
  if (!parsedInfo || typeof parsedInfo.fieldsByTypeName !== 'object') return [];

  const typename = Object.keys(parsedInfo.fieldsByTypeName)[0];
  const fields = parsedInfo.fieldsByTypeName[typename];

  return Object.keys(fields);
}
