export const formatDate = (date: Date) =>
	new Intl.DateTimeFormat('nl-NL', { dateStyle: 'full' }).format(date)
