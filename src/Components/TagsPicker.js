import React from 'react';
import { Popover, Overlay } from 'react-bootstrap';
import { database, firebase } from '../Firebase/firebase';

import '../Styling/TagsPicker.scss';
import { hasEmptySpaces } from '../GlobalMethods';

function TagsPicker(props) {

    const [autoFocus, setAutoFocus] = React.useState(false);
    const [show, setShow] = React.useState(false);
    const [tags, setTags] = React.useState(props.tags);
    const [selectedTagValue, setSelectedTagValue] = React.useState("");
    const [didSelectTag, setDidSelectTag] = React.useState(false);
    const target = React.useRef(null);

    const user = firebase.auth().currentUser;

    React.useEffect(() => {
        setTags(props.tags);
        // setSelectedTagValue(tags.length ? props.tags[0] : "");
    }, [props.tags])

    const removeTags = indexToRemove => {

        var newTagsArr = tags.filter((_, index) => index !== indexToRemove);

        setTags(newTagsArr);
        //update tags in firebase
        database.collection("users").doc(user.uid).update({
            tags: newTagsArr
        });
    }

    const handleNewTagInput = e => {
        if (e.currentTarget.value) {
            setShow(false);
            setDidSelectTag(true);
        }
        props.gettagspickervalue(e.currentTarget.value);
    }

    const handleExistingTagSelect = (tag) => {
        setDidSelectTag(true);
        setSelectedTagValue(tag);
        props.gettagspickervalue(tag);
    }

    const handleOpenEditTagInput = e => {
        setDidSelectTag(false);
        setAutoFocus(true);
    }

    return (
        <div>
            <div onFocus={() => setShow(true)} onBlur={() => setShow(false)} className="TagsPicker-container">

                {
                    didSelectTag ?
                        <div ref={target} onClick={handleOpenEditTagInput} className="TagsPicker-NewTag-Container">
                            <ul className="TagsPicker-ul">
                                <li>
                                    <span>{selectedTagValue}</span>
                                </li>
                                {
                                    //<input className="TagsPicker-textbox" placeholder="Add new tags" type="text" onKeyUp={e => (e.key === "Enter" ? addTags(e) : null)} />
                                }
                            </ul>
                        </div> :
                        <input ref={target} autoFocus={autoFocus} className="TagsPicker-textbox" value={selectedTagValue} onChange={e => setSelectedTagValue(hasEmptySpaces(e.currentTarget.value) ? "" : e.currentTarget.value)} type="text" placeholder="Add new tag" onBlur={handleNewTagInput} onKeyUp={e => (e.key === "Enter" ? handleNewTagInput(e) : null)} />

                }

                {
                    tags.length ?

                        <Overlay target={target.current} show={show} placement="top">
                            {({
                                placement,
                                scheduleUpdate,
                                arrowProps,
                                outOfBoundaries,
                                show: _show,
                                ...props
                            }) => (

                                    <Popover {...props} placement="top" className="TagsPicker-Popover" id="popover-basic">
                                        <Popover.Content>
                                            <p className="TagsPicker-Popover-Label">Or select an existing tag</p>
                                            <div className="TagsPicker-Popover-ExistingTags-Container">
                                                <ul className="TagsPicker-ul">
                                                    {
                                                        tags.map((tag, index) => (
                                                            <li key={index}>
                                                                <span onClick={() => handleExistingTagSelect(tag)}>{tag}</span>
                                                                <img onClick={() => removeTags(index)} className="TagsPicker-xBtn" alt="x icon" src="/Assets/Images/xIcon.png" />
                                                            </li>
                                                        ))
                                                    }
                                                    {
                                                        //<input className="TagsPicker-textbox" placeholder="Add new tags" type="text" onKeyUp={e => (e.key === "Enter" ? addTags(e) : null)} />
                                                    }
                                                </ul>
                                            </div>
                                        </Popover.Content>
                                    </Popover>
                                )}
                        </Overlay>

                        : null
                }

            </div>
        </div>
    )

}

export default TagsPicker;