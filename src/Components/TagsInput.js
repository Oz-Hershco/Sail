import React from 'react';
import { database, firebase } from '../Firebase/firebase';

import '../Styling/TagsInput.scss';

function TagsInput(props) {

    const [tags, setTags] = React.useState(props.tags);

    const user = firebase.auth().currentUser;

    React.useEffect(() => {
        setTags(props.tags);
    }, [props.tags])

    const removeTags = indexToRemove => {

        var newTagsArr = tags.filter((_, index) => index !== indexToRemove);

        setTags(newTagsArr);
        //update tags in firebase
        database.collection("users").doc(user.uid).update({
            tags: newTagsArr
        });
    }

    const addTags = e => {
        if (e.target.value !== "") {
            var newTagsArr = [...tags, e.target.value];
            // console.log(newTagsArr)
            setTags(newTagsArr);
            e.target.value = "";
            //update tags in firebase
            database.collection("users").doc(user.uid).update({
                tags: newTagsArr
            });
        }
    }

    return (
        <div>
            <p className="TagsInput-tags-title">Add/Remove Tags</p>

            <div className="TagsInput-container">

                <ul className="TagsInput-ul">
                    {
                        tags.map((tag, index) => (
                            <li key={index}>
                                <span>{tag}</span>
                                <img onClick={() => removeTags(index)} className="TagsInput-xBtn" alt="x icon" src="/Assets/Images/xIcon.png" />
                            </li>
                        ))}

                    <input className="TagsInput-textbox" placeholder="Add new tags" type="text" onKeyUp={e => (e.key === "Enter" ? addTags(e) : null)} />
                </ul>
            </div>
        </div>
    )

}

export default TagsInput;