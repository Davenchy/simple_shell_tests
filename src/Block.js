import {
	faChevronDown as iDown,
	faChevronRight as iRight
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as FAI } from "@fortawesome/react-fontawesome";
import { useState } from "react"

export default function Block({children, name, color, size}) {
	const [isOpen, setViewState] = useState(false);
	const hasChildren = !!children && children.length;
	const toggleViewState = _ => hasChildren && setViewState(s => !s);
	return <li>
		<div className="list-item">
		{hasChildren ? <FAI icon={isOpen ? iRight : iDown}/> : null}
		<h3 onClick={toggleViewState} style={{"cursor": "pointer"}}>
			<span style={{
				color: color || "inherit",
				fontSize: size ? `${size*12}px` : "inherit",
			}} dangerouslySetInnerHTML={{__html: name}}></span>
		</h3>
		</div>
		{isOpen ? <ul>{children}</ul> : null}
	</li>
}
