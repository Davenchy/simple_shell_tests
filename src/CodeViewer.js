import "./dialog.css"
import {useContext, createContext, useState, useEffect, useRef, forwardRef} from "react"
import SyntaxHighlighter from 'react-syntax-highlighter'
import {atomOneDark} from 'react-syntax-highlighter/dist/esm/styles/hljs'
import {FontAwesomeIcon as FAI} from "@fortawesome/react-fontawesome"
import {
	faDownload as iDownload,
	faExpandAlt as iFullscreen
} from "@fortawesome/free-solid-svg-icons"

const CodeViewerContext = createContext();

const reduceState = {
	url: "",
	code: "",
	filename: "",
	visible: false
};

function useCodeFetcher() {
	const {url, close} = useContext(CodeViewerContext);
	const [code, setCode] = useState("")

	useEffect(() => {
		if (!url)
			setCode("");
		else
			fetch(url).then(res => {
				if (!res.ok)
					setCode("")
				res.text().then(setCode)
			})
	}, [url]);
	return [url, code, close];
}

function Code(props) {
	return (
	<SyntaxHighlighter language="bash" style={atomOneDark} showLineNumbers={true}>
		{props.code}
	</SyntaxHighlighter>
	)

}


function CodeViewer() {
	const [url, code, close] = useCodeFetcher();
	const [isFullscreen, setFullscreen] = useState(false);
	const toggleFullscreen = () => isFullscreen ?
		document.exitFullscreen() : document.body.requestFullscreen();
	useEffect(() => {
		const handler = e => setFullscreen(!!document.fullscreenElement);
		const key_handler = e => (
			(e.key == "Escape" && close()) ||
			(e.key == "f" && code && toggleFullscreen())
		)
		document.body.addEventListener("fullscreenchange", handler)
		document.body.addEventListener("keydown", key_handler);
		return () => {
			document.body.removeEventListener("fullscreenchange", handler)
			document.body.removeEventListener("keydown", key_handler)
		}
	}, [code])

	return (
	code ?
		isFullscreen ? <div className="fullscreen">
			<p className="close" onClick={toggleFullscreen}>&times;</p>
			<Code code={code} />
		</div> :
		<div className="dialog">
			<div className="dialog-header">
				<h3>file: /assets/files/5/3/checker.bash</h3>
				<span className="btn" onClick={toggleFullscreen}>
					<FAI icon={iFullscreen} />
				</span>
				<a href={url} className="btn"><FAI icon={iDownload}/></a>
				<p className="close btn" onClick={close}>&times;</p>
			</div>
			<Code code={code} />
		</div>
	: <></>
	);
}

export function CodeViewerProvider(props) {
	const [url, setUrl] = useState("");
	const open = (filename, taskIndex, checkIndex) => 
		setUrl(`/assets/files/${taskIndex}/${checkIndex}/${filename}`)
	const close = () => setUrl("")

	return <CodeViewerContext.Provider value={{url, setUrl, open, close}}>
		<CodeViewer />
		{props.children}
	</CodeViewerContext.Provider>
}

export const useCodeViewer = () => useContext(CodeViewerContext);
