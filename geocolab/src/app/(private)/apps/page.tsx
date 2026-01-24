import { redirect } from 'next/navigation';

function AppsPage() {
	redirect(`/apps/example`);
	return null;
}

export default AppsPage;
