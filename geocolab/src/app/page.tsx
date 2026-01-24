import { redirect } from 'next/navigation';

function MainPage() {
	redirect(`/coming-soon`);
	return null;
}

export default MainPage;