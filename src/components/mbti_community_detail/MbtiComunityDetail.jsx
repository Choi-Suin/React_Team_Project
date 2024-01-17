import { doc, getDoc } from 'firebase/firestore';
import { React, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import heart from '../../assets/community/blackheart.svg';
import eyeImoge from '../../assets/community/eyeImoge.svg';
import redheart from '../../assets/community/heart.svg';
import messageImoge from '../../assets/community/messageImoge.svg';
import { db } from '../../firebase/firebase.config';

const MbtiComunityDetail = () => {
    const [post, setPost] = useState();
    const params = useParams();
    // console.log(params?.id);

    const getPost = async (id) => {
        if (id) {
            const docRef = doc(db, 'communities', id);
            const docSnap = await getDoc(docRef);

            setPost({ id: docSnap.id, ...docSnap.data() });
        }
    };

    useEffect(() => {
        if (params?.id) getPost(params?.id);
    }, [params?.id]);
    // console.log(post);
    return (
        <StCardWrapper>
            <StCardImage src={post?.communityImage} alt="컨텐츠의 사진" />
            <StTitleWrapper>
                <StCardTitle>{post?.title}</StCardTitle>
                <img src={redheart} alt="" />
            </StTitleWrapper>
            <StuserInfoWrapper>
                <StUserInformation>
                    <StprofileImg src={post?.ImageUrl} alt="" />
                    <div>
                        {post?.nickname} / {post?.mbti}
                    </div>
                </StUserInformation>
                <StlikeInformation>
                    <img src={heart} alt="좋아요 이미지" />
                    <div>999M</div>
                </StlikeInformation>
                <StMessageInformation>
                    <img src={messageImoge} alt="" />
                    <div>999K</div>
                </StMessageInformation>
                <StViewInformation>
                    <img src={eyeImoge} alt="" />
                    <div>999M</div>
                </StViewInformation>
            </StuserInfoWrapper>
            <StButtonWrapper>
                <Stbutton>글 수정</Stbutton>
                <Stbutton>글 삭제</Stbutton>
            </StButtonWrapper>
            <StHr />
            <StContent>{post?.content}</StContent>
        </StCardWrapper>
    );
};

export default MbtiComunityDetail;

const StCardWrapper = styled.div`
    width: 1200px;
    border-radius: 26px;
    border: 1px solid #ededed;
    background: #fff;
    margin: 142px auto 40px;
`;

const StCardImage = styled.img`
    width: 1160px;
    height: 540px;
    border-radius: 16px;
    margin: 20px 20px 16px 20px;
`;

const StTitleWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0px auto 14px 32px;
`;

const StCardTitle = styled.div`
    color: #000;
    font-size: 24px;
    font-style: normal;
    font-weight: 500;
    line-height: 120%;
`;

const StuserInfoWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    gap: 48px;
    margin: 0px auto 0px 32px;
    width: 100%;
`;

const StUserInformation = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const StprofileImg = styled.img`
    width: 38px;
    height: 38px;
    fill: #efefef;
    stroke-width: 1px;
    stroke: #8d8d8d;
    border-radius: 50%;
`;
const StlikeInformation = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 4px;
`;

const StMessageInformation = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 4px;
`;

const StViewInformation = styled.div`
    display: flex;
    align-items: flex-start;
    gap: 4px;
`;

const StButtonWrapper = styled.div`
    display: flex;
    flex-direction: row-reverse;
    margin-right: 32px;
    gap: 4px;
`;

const Stbutton = styled.button`
    width: 76px;
    height: 34px;
    padding: 10px;
    justify-content: center;
    align-items: center;
    gap: 10px;
    border-radius: 6px;
    background: #f8f8f8;
    color: #969696;
    font-size: 15px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.3px;
`;

const StHr = styled.div`
    width: 1104.002px;
    height: 1px;
    background: #ececec;
    margin: 26px 48px 44px 48px;
`;

const StContent = styled.div`
    width: 1136px;
    color: #121212;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 148%; /* 23.68px */
    letter-spacing: -0.08px;
    margin: 0px 32px 68px 32px;
`;