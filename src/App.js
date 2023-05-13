import './App.css';
import data from "./tasks.json"
import Block from './Block'
import {CodeViewerProvider, useCodeViewer} from './CodeViewer';

function Check({index, title, files, points, taskIndex, check_label}) {
	const { open } = useCodeViewer();
	const openFile = name => open(name, taskIndex, index)

	return <Block name={`${index}. ${title}`} size="1.3">
		{ check_label ? <p>Type: {check_label}</p> : null}
		{points ? <p>Points: {points.toFixed(2)}</p> : null}
		{ files
			?	<div>
					<p>Files:</p>
					<ul>
						{files.map(
							(file, i) =>
						<li key={i}>
							<div className="file" onClick={() =>
								openFile(file.name)}>{file.name}</div>
						</li>
						)}
					</ul>
				</div>
			: null
		}
	</Block>
}

function Task({index, title, checks}) {
	return <Block name={`${index}. ${title}`} color="#2196f3" size="1.7">
		{!checks
			? null
			: checks.map(
				(check, i) =>
					<Check key={`check-${i}`} {...check} index={i} taskIndex={index} />
		)}
	</Block>;
}

function App() {
  return (
	<CodeViewerProvider>	
    <div className='tasks'>
			<ul>
				{data.map(
					(obj, i) => <Task key={`task-${i}`} {...obj.correction} index={i} />
				)}
			</ul>
    </div>
		</CodeViewerProvider>
  );
}

export default App;
