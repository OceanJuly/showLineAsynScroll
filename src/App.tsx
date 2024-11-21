import { Suspense } from 'react'
import EditPage from '@/views/editPage.tsx'

function App() {
	return (
		<div className="App">
			<Suspense fallback="loading">
				<div className="main">
					<EditPage />
				</div>
			</Suspense>
		</div>
	)
}

export default App
