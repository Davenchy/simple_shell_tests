import './App.css';
import data from "./tasks.json"
import Block from './Block'
import {CodeViewerProvider, useCodeViewer} from './CodeViewer';
import {FontAwesomeIcon as FAI} from "@fortawesome/react-fontawesome"
import {
	faDownload as iDownload,
	faCopy as iCopy,
} from "@fortawesome/free-solid-svg-icons"
import {copyText, createUrl, fetchCode} from './utils.js'

function Check({index, title, files, points, taskIndex, check_label}) {
	const { open } = useCodeViewer();
	const openFile = name => open(name, taskIndex, index)
	const copy = name => fetchCode(createUrl(taskIndex, index, name))
		.then(code => copyText(code));

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
							<div className="file">
								<span onClick={() => openFile(file.name)}>{file.name}</span>
								<span onClick={() => copy(file.name)}><FAI icon={iCopy} /></span>
							<a href={createUrl(taskIndex, index, file.name)} className="btn">
								<FAI icon={iDownload}/>
							</a>
							</div>
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
			<div className='help'>
					<center>
					<h1>Simple-Shell Test Cases</h1>
					</center>
			<h2>How To Use??</h2>
			<p>
				<span style={{fontWeight: "bold"}}>Super simple</span>, 
					you need to download the <code>checker.bash</code> script
					and the <u>test case script</u><br />
					both can be downloaded 
					by selecting the task and the checker test case.<br />
					Then execute <code>./checker.bash ./hsh {"<test case script>"}</code>
			</p>
			<p style={{color: '#f44336'}}>
				Only use to solve failed tasks after using the checker, Otherwise
				you will waste your time.
			</p>
			</div>
				<hr />
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
