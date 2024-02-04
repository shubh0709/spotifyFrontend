import React, { useEffect, useMemo, useState } from "react";
import styles from "./CommentSection.module.css";
import { getComments, postComment, postReply } from "../api/api";
import { Comments, SongDetails } from "../types";

export function Comment({
    text,
    username,
    onReplyClick,
    isReplying,
    commentId,
    handlePostReply
}: {
    text: string,
    username: string,
    onReplyClick: () => void,
    isReplying: boolean,
    commentId: string,
    handlePostReply: (commentId: string, replyText: string) => void
}) {
    const [replyText, setReplyText] = useState('');

    const submitReply = () => {
        handlePostReply(commentId, replyText);
        setReplyText('');
    };

    return (
        <div className={styles.commentContainer}>
            <div className={styles.dummyHeight} />
            <p className={styles.commentHeaderText}>{commentId}</p>
            <div className={styles.dummyHeight} />
            <p className={styles.commentHeaderText}>{username}</p>
            <div className={styles.dummyHeight} />
            <p className={styles.commentDescText}>{text}</p>
            <div className={styles.dummyHeight} />
            <button className={styles.button} onClick={onReplyClick}>
                <p className={styles.commentFooterText}>Reply</p>
            </button>
            <div className={styles.dummyHeight} />
            {isReplying && (
                <div className={styles.replyToCommentContainer}>
                    <textarea
                        className={styles.textArea}
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                    />
                    <button
                        className={styles.button}
                        onClick={submitReply}
                    >
                        Post Reply
                    </button>
                </div>
            )}
        </div>
    );
}


export function LoadMoreComments({ data, onReplyClick, replyingTo, handlePostReply }: {
    data: Comments[],
    onReplyClick: (commentId: string) => void,
    replyingTo: string | null,
    handlePostReply: (commentId: string, replyText: string) => void
}) {
    return (
        <div className={styles.commentThread}>
            {data.length ? data.map((dataItem) => (
                <div key={dataItem.id}>
                    <Comment
                        text={dataItem.text}
                        username={dataItem.username}
                        onReplyClick={() => onReplyClick(dataItem.id)}
                        isReplying={replyingTo === dataItem.id}
                        commentId={dataItem.id}
                        handlePostReply={handlePostReply}
                    />
                    <LoadMoreComments
                        data={dataItem.replies}
                        onReplyClick={onReplyClick}
                        replyingTo={replyingTo}
                        handlePostReply={handlePostReply}
                    />
                </div>
            )) : <></>}
        </div>
    );
}


export function PostNewComment({ text, setText, handleSubmit, placeholder }: { text: string, handleSubmit: () => void, setText: (text: string) => void, placeholder: string }) {
    const handleInputChange = (e) => {
        setText(e.target.value);
    };

    return (
        <div className={styles.postCommentContainer}>
            <textarea
                className={styles.textArea}
                value={text}
                onChange={handleInputChange}
                placeholder={placeholder}
                aria-label={placeholder}
            />
            <button
                className={styles.button}
                onClick={handleSubmit}
            >
                Post
            </button>
        </div>
    );
}

// ReplyToComment.js
export function ReplyToComment({ commentId, handlePostReply }: { commentId: string, handlePostReply: (commentId: string, replyText: string) => void }) {
    const [replyText, setReplyText] = useState('');

    const submitReply = () => {
        handlePostReply(commentId, replyText);
        setReplyText('');
    };

    return (
        <PostNewComment
            text={replyText}
            setText={setReplyText}
            handleSubmit={submitReply}
            placeholder="Write a reply..."
        />
    );
}

const updateCommentReplies = (comments: Comments[], commentId: string, newReply: Comments) => {
    return comments.map(comment => {
        if (comment.id === commentId) {
            return { ...comment, replies: [...comment.replies, newReply] };
        } else if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateCommentReplies(comment.replies, commentId, newReply) };
        }
        return comment;
    });
};



export function CommentSection({ songDetails }: { songDetails: SongDetails }) {
    const [comments, setComments] = useState<Comments[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null);

    useEffect(() => {
        if (songDetails.trackId) {
            fetchComments(songDetails.trackId);
        }
    }, [songDetails.trackId]);

    const fetchComments = async (trackId: string) => {
        setLoading(true);
        try {
            const fetchedComments = await getComments(trackId);
            setComments(fetchedComments);
        } catch (err) {
            setError('Failed to fetch comments');
        } finally {
            setLoading(false);
        }
    };

    const handlePostNewComment = async () => {
        if (!newComment.trim()) return;
        setLoading(true);
        try {
            const postedComment = await postComment(songDetails.trackId, newComment);
            setComments([...comments, postedComment]);
            setNewComment('');
        } catch (err) {
            setError('Failed to post comment');
        } finally {
            setLoading(false);
        }
    };

    const handlePostReply = async (commentId: string, replyText: string) => {
        if (!replyText.trim()) return;
        setLoading(true);

        try {
            const newReply: Comments = { id: `${Date.now()}`, trackId: commentId, text: replyText, username: 'Current User', replies: [] };
            const updatedComments = updateCommentReplies(comments, commentId, newReply);
            setComments(updatedComments);
            setReplyingTo(commentId);

            const replyResponse = await postReply(commentId, replyText);
            setTimeout(() => fetchComments(songDetails.trackId), 1000);
        } catch (err) {
            setError('Failed to post reply');
            console.error(err);
            fetchComments(songDetails.trackId);
        } finally {
            setLoading(false);
        }
    };


    const commentElements = comments.map(comment => (
        <div key={comment.id}>
            <Comment
                text={comment.text}
                username={comment.username}
                onReplyClick={() => setReplyingTo(comment.id)}
                isReplying={replyingTo === comment.id}
                commentId={comment.id}
                handlePostReply={handlePostReply}
            />
            <LoadMoreComments
                data={comment.replies}
                onReplyClick={setReplyingTo}
                replyingTo={replyingTo}
                handlePostReply={handlePostReply}
            />
        </div>
    ));

    return (
        <div className={styles.mainContainer}>
            <PostNewComment
                text={newComment}
                setText={setNewComment}
                handleSubmit={handlePostNewComment}
                placeholder="Write a new comment..."
            />
            {loading && <p>Loading comments...</p>}
            {error && <p>Error: {error}</p>}
            {commentElements}
        </div>
    );
}