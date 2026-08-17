export const errors={

}


export function humaniseErrorType(errorType: string): string {
  return errorType.replaceAll('_', ' ').toLowerCase();
}