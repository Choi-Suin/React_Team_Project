import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db, storage } from '../../firebase/firebase.config';
import Avatar from '../common/avatar';
import profileImage from '../../assets/profile/image.png';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import UserWritelist from './UserWritelist';
import { UserImageAtom, UserMbtiAtom, UserNameAtom, loginIdAtom } from '../../recoil/Atom';
const UserInfo = () => {
    const userProfileSmallImage = useSetRecoilState(UserImageAtom);
    const userNameRecoil = useSetRecoilState(UserNameAtom);
    const userMbtiRecoil = useSetRecoilState(UserMbtiAtom);
    const [user, setUsers] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [previewURL, setPreviewURL] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [userName, setUserName] = useState('');
    const [userNickname, setUsernickname] = useState('');
    const [userBirth, setUserBirth] = useState('');
    const [userMbti, setUserMbti] = useState('');
    const [userBlood, setUserBlood] = useState('');
    const [userLocation, setUserLocation] = useState('');
    const [userIntro, setUserIntro] = useState('');
    const [isImageEditing, setIsImageEditing] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const userUuId = useRecoilValue(loginIdAtom);
    useEffect(() => {
        if (user) {
            setUserName(user.name);
            setUsernickname(user.nickname);
            setUserBirth(user.birth);
            setUserMbti(user.mbti);
            setUserBlood(user.blood);
            setUserLocation(user.location);
            setUserIntro(user.introduce);
        }
    }, [user]);

    //  이미지 미리보기 및 선택한 파일 업로드를 처리한다
    const fileSelectHandler = (event) => {
        const file = event.target.files[0];
        // 선택한 파일의 미리보기를 생성
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewURL(e.target.result);
            };
            reader.readAsDataURL(file);
        }
        setSelectedFile(file);
    };
    //  이펙트 내에서의 onSnapshot 콜백 함수
    const handleSnapshot = (querySnapshot) => {
        querySnapshot.forEach((doc) => {
            setUsers({
                id: doc.id,
                ...doc.data()
            });
        });
    };
    // 해당 uid값만 가져온다
    useEffect(() => {
        console.log(userUuId);
        const fetchData = onSnapshot(query(collection(db, 'users'), where('uid', '==', userUuId)), handleSnapshot);
        return fetchData; // cleanup 함수
    }, []);
    // 버튼 클릭시 boolean 값 바꾸기
    const toggleInput = () => {
        setIsEditing((prevState) => !prevState);
    };
    // 프로필 수정 버튼 입력 후 입력한 값이 수정(추가)이 된다.
    const updateUserinfo = async () => {
        const userRef = doc(db, 'users', user.id);
        const storageRef = ref(storage, 'user_images/' + user.id);
        try {
            const imageFile = selectedFile;
            if (imageFile) {
                // 이미지 파일이 선택되었을 때만 업로드
                await uploadBytes(storageRef, imageFile);
                // 업로드된 이미지의 다운로드 URL 가져오기
                const imageUrl = await getDownloadURL(storageRef);
                // 사용자 정보 업데이트
                await updateDoc(userRef, {
                    nickname: userNickname,
                    name: userName,
                    birth: userBirth,
                    mbti: userMbti,
                    blood: userBlood,
                    location: userLocation,
                    introduce: userIntro,
                    imageUrl: imageUrl
                });
                userProfileSmallImage(imageUrl);
                userNameRecoil(userName);
                userMbtiRecoil(userMbti);
            } else {
                await updateDoc(userRef, {
                    nickname: userNickname,
                    name: userName,
                    birth: userBirth,
                    mbti: userMbti,
                    blood: userBlood,
                    location: userLocation,
                    introduce: userIntro
                });
                userNameRecoil(userName);
                userMbtiRecoil(userMbti);
            }
            console.log('update successful');
        } catch (error) {
            console.error('업로드 실패', error);
        }
    };
    return (
        <>
            <StProfileTitle>마이페이지</StProfileTitle>
            <StWrapper>
                <StUserwrapper>
                    <>
                        <StProfileImage>
                            {isEditing ? (
                                <label htmlFor="inputFile">
                                    <ProfilePointerAvatar
                                        src={previewURL || user.imageUrl}
                                        for="inputFile"
                                        size="large"
                                    />
                                    <Stinput type="file" id="inputFile" accept="image/*" onChange={fileSelectHandler} />
                                </label>
                            ) : (
                                <Avatar src={user.imageUrl || profileImage} size="large" />
                            )}
                            <button>프로필 사진 업로드</button>
                        </StProfileImage>
                        {/* <StProfileImageButton
                            onClick={() => {
                                setIsImageEditing(!isImageEditing);
                            }}
                        >
                            프로필 사진 업로드
                        </StProfileImageButton> */}
                    </>
                    <StInputBox>
                        <StUserInfo>
                            {isEditing ? (
                                <>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>이름</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="홍길동"
                                                    value={userName}
                                                    defaultValue={user.name}
                                                    onChange={(e) => {
                                                        setUserName(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>닉네임</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="20자 이내(띄어쓰기 포함)로 작성해주세요."
                                                    value={userNickname}
                                                    onChange={(e) => {
                                                        setUsernickname(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>생년월일</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="0000.00.00"
                                                    value={userBirth}
                                                    onChange={(e) => {
                                                        setUserBirth(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>거주지</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="OO시 OO구"
                                                    value={userLocation}
                                                    onChange={(e) => {
                                                        setUserLocation(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>MBTI</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="자신의 MBTI를 입력하세요."
                                                    value={userMbti}
                                                    onChange={(e) => {
                                                        setUserMbti(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>혈액형</StminiTitle>
                                            <StminiContent>
                                                <input
                                                    placeholder="자신의 혈액형을 입력하세요."
                                                    value={userBlood}
                                                    onChange={(e) => {
                                                        setUserBlood(e.target.value);
                                                    }}
                                                />
                                            </StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>한 줄 소개</StminiTitle>
                                            <StminiContent2>
                                                <input
                                                    placeholder="간단하게 나를 소개해보세요 !"
                                                    value={userIntro}
                                                    onChange={(e) => {
                                                        setUserIntro(e.target.value);
                                                    }}
                                                    autoFocus
                                                />
                                            </StminiContent2>
                                        </Stlist>
                                    </StlistWrapper>
                                </>
                            ) : (
                                <>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>이름</StminiTitle>
                                            <StminiContent>{user.name}</StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>닉네임</StminiTitle>
                                            <StminiContent>{user.nickname}</StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>생년월일</StminiTitle>
                                            <StminiContent>{user.birth}</StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>거주지</StminiTitle>
                                            <StminiContent>{user.location}</StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>MBTI</StminiTitle>
                                            <StminiContent>{user.mbti}</StminiContent>
                                        </Stlist>
                                        <Stlist>
                                            <StminiTitle>혈액형</StminiTitle>
                                            <StminiContent>{user.blood}</StminiContent>
                                        </Stlist>
                                    </StlistWrapper>
                                    <StlistWrapper>
                                        <Stlist>
                                            <StminiTitle>한줄소개</StminiTitle>
                                            <StminiContent2>{user.introduce}</StminiContent2>
                                        </Stlist>
                                    </StlistWrapper>
                                </>
                            )}
                        </StUserInfo>
                        <StBtnDiv onClick={() => toggleInput()}>
                            {isEditing ? (
                                <ButtonWrapper>
                                    <StEditBtn
                                        onClick={() => {
                                            updateUserinfo();
                                        }}
                                    >
                                        프로필 수정 완료
                                    </StEditBtn>
                                    <StCancelBtn
                                        onClick={() => {
                                            setIsEditing(true);
                                        }}
                                    >
                                        프로필 수정 취소
                                    </StCancelBtn>
                                </ButtonWrapper>
                            ) : (
                                <StEditBtn>프로필 수정</StEditBtn>
                            )}
                        </StBtnDiv>
                    </StInputBox>
                </StUserwrapper>
            </StWrapper>
        </>
    );
};
export default UserInfo;

const StWrapper = styled.div`
    background-color: white;
    border: 1px solid var(--content-border-color);
    border-radius: 10px;
    display: flex;
    margin: 10px auto;
    width: 60%;
    height: 400px;
`;
const StProfileTitle = styled.div`
    font-size: 24px;
    color: var(--bold-gray);
    width: 60%;
    padding: 0px 0px 0px 10px;
`;
const StProfileImage = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-left: 50px;
    margin-right: 50px;
    width: 40%;

    & button {
        width: 180px;
        height: 40px;
        font-size: 18px;
        color: var(--bold-gray);
        border: 1px solid var(--button-border-color);
        border-radius: 5px;
        margin-top: 25px;
    }
`;
const StUserInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 90%;

    input {
        width: 70px;
        margin: -10px 10px -10px 10px;
        background-color: transparent;
    }
`;
const StUserwrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background: white;
`;
const StProfileImageButton = styled.button`
    display: inline-flex;
    height: 48px;
    padding: 10px 14px;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    border: 1px solid var(--border-color);
    color: var(--bold-gray);
    font-size: 18px;
    letter-spacing: 0.4px;
    margin-left: 80px;
    cursor: pointer;
`;
const StBtnDiv = styled.div`
    position: absolute;
    bottom: 10;
    left: 0;
`;
const StEditBtn = styled.button`
    width: 180px;
    height: 40px;
    border-radius: 5px;
    font-size: 18px;
    background-color: var(--main-button-color);
    color: white;
`;
const StCancelBtn = styled.button`
    width: 180px;
    height: 40px;
    border-radius: 5px;
    font-size: 18px;
    background-color: var(--light-gray);
    color: var(--bold-gray);
`;
const ProfilePointerAvatar = styled(Avatar)`
    cursor: pointer;
`;
const Stinput = styled.input`
    display: none;
`;
const StlistWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 66px;
`;
const Stlist = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;
const StminiTitle = styled.div`
    width: 50%;
    font-size: 14px;
    letter-spacing: 1px;
    padding-bottom: 5px;
    padding-left: 10px;
`;
const StminiContent = styled.div`
    width: 90%;
    border-radius: 5px;
    background: var(--light-gray);
    margin: 0px 50px 10px 0px;
    height: 70px;
    padding: 10px;
    display: flex;
    align-items: center;

    input {
        width: 100%;
        border: none;
        padding: 10px;

        &:focus {
            border: 1px solid #abaad8;
            border-radius: 5px;
            width: 100%;
            outline: none;
        }
    }
`;
const StminiContent2 = styled.div`
    width: 95%;
    border-radius: 5px;
    background: var(--light-gray);
    margin: 0px 50px 10px 0px;
    height: 70px;
    padding: 10px;
    display: flex;
    align-items: center;

    input {
        width: 100%;
        border: none;
        padding: 10px;

        &:focus {
            border: 1px solid #abaad8;
            border-radius: 5px;
            width: 100%;
            outline: none;
        }
    }
`;
const StInputBox = styled.div`
    position: relative;
    width: 100%;
    height: 85%;
    padding: 0;
    margin: 0;
`;
const ButtonWrapper = styled.div`
    gap: 10px;
    display: flex;
`;
const StHr = styled.hr`
    color: var(--light-gray);
    margin: 80px;
    width: 50%;
`;
