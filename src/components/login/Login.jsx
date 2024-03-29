import { signInWithEmailAndPassword } from 'firebase/auth';
import { default as React, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Swal from 'sweetalert2';
import logo from '../../assets/home/footerLogo.png';
import modal_logo from '../../assets/home/headerLogo.png';
import kakao from '../../assets/login/kakao.png';
import { auth } from '../../firebase/firebase.config';
import GoogleLogin from './GoogleLogin';
import { useRecoilState } from 'recoil';
import { createMeetingState } from '../../recoil/recoilAtoms';

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [newMeeting, setNewMeeting] = useRecoilState(createMeetingState);

    const handleClickLoginButton = async () => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, userId, userPw);
            const user = userCredential.user;

            navigate('/');

            Swal.fire({
                title: '로그인 성공!',
                text: '다양한 유형의 사람들과 자유롭게 소통하세요 !',
                imageUrl: modal_logo,
                imageWidth: 300,
                imageAlt: 'Custom image',
                confirmButtonText: '♥ 네 ♥'
            });
        } catch (error) {
            console.log('error.code : ', error.code);
            switch (error.code) {
                case 'auth/user-not-found" || "auth/wrong-password':
                case 'auth/network-request-failed':
                    return Swal.fire({
                        icon: 'error',
                        position: 'center',
                        title: '네트워크 연결에 실패 하였습니다.',
                        text: '잠시 후에 다시 시도해 주세요.',
                        confirmButtonColor: '#756ab6'
                    });
                case 'auth/invalid-email':
                    return Swal.fire({
                        icon: 'error',
                        position: 'center',
                        title: '잘못된 이메일 형식입니다.',
                        text: '유효한 이메일 형식으로 작성해주세요.',
                        confirmButtonColor: '#756ab6'
                    });
                case 'auth/invalid-credential':
                    return Swal.fire({
                        icon: 'error',
                        position: 'center',
                        title: '잘못된 정보를 입력하였습니다.',
                        text: '가입한 계정의 정보를 입력해주세요.',
                        confirmButtonColor: '#756ab6'
                    });
                default:
                    return Swal.fire({
                        icon: 'error',
                        position: 'center',
                        title: '로그인에 실패하였습니다.',
                        text: '이메일 주소와 비밀번호를 확인해주세요.',
                        confirmButtonColor: '#756ab6'
                    });
            }
        }
    };

    return (
        <StPage>
            <StLoginWrap>
                <StLogo src={logo} alt="logo" />
                <StUserId
                    placeholder="이메일을 입력해주세요"
                    type="email"
                    value={userId}
                    name="userId"
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    autoFocus
                ></StUserId>
                <StUserPw
                    placeholder="비밀번호를 입력해주세요"
                    type="password"
                    value={userPw}
                    name="userPw"
                    onChange={(e) => setUserPw(e.target.value)}
                    required
                ></StUserPw>
                <StPwChangeSignUpButtonWrap>
                    <StPwChange
                        onClick={() => {
                            navigate('/pwchange');
                        }}
                    >
                        비밀번호 변경
                    </StPwChange>
                    <StSignUpButton
                        onClick={() => {
                            navigate('/signup');
                        }}
                    >
                        회원가입
                    </StSignUpButton>
                </StPwChangeSignUpButtonWrap>

                <StLoginSignUpWarp>
                    <StLoginButton disabled={!userId || !userPw} onClick={handleClickLoginButton}>
                        로그인
                    </StLoginButton>
                </StLoginSignUpWarp>
                <StStartText>SNS로 간편하게 시작하기</StStartText>
                <StExternalLoginWrap>
                    {/* <StKakaoLogin type="button" onClick={() => {}}>
                        <StKakaoImg src={kakao} alt="" />
                    </StKakaoLogin> */}
                    <GoogleLogin></GoogleLogin>
                </StExternalLoginWrap>
            </StLoginWrap>
        </StPage>
    );
};

export default Login;

const StPage = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background-color: var(--background-color);
`;

const StLoginWrap = styled.div`
    margin-top: 50px;
    display: flex;
    flex-direction: column;
    width: 468px;
    height: 622px;
    background-color: white;
    border-radius: 16px;
    border: 1px solid var(--content-border-color);
`;

const StLogo = styled.img`
    width: 408px;
    margin: 58px auto 76px;
`;

const StUserId = styled.input`
    width: 402px;
    height: 47px;
    margin: 0px auto;
    outline: none;
    border-radius: 10px;
    border: 1px solid var(--main-button-color);
    background-color: var(--light-gray);
    font-size: large;
    color: black;
`;

const StUserPw = styled.input`
    width: 402px;
    height: 47px;
    margin: 12px auto 0px;
    outline: none;
    border-radius: 10px;
    border: 0px;
    font-size: large;
    background-color: var(--light-gray);
`;

const StPwChangeSignUpButtonWrap = styled.div`
    width: 440px;
    margin: 0px auto;
    display: flex;
    justify-content: space-between;
`;
const StPwChange = styled.button`
    text-decoration: underline;
    margin: 14px 0px 48px 20px;
    color: var(--bold-gray);
    cursor: pointer;
    width: 90px;
    height: 20px;
`;

const StSignUpButton = styled.button`
    text-decoration: underline;
    margin: 14px 0px 48px 20px;
    color: var(--bold-gray);
    cursor: pointer;
    width: 90px;
    height: 20px;
`;

const StLoginSignUpWarp = styled.div`
    display: flex;
    justify-content: center;
    margin: 0px auto;
    gap: 10px;
`;

const StLoginButton = styled.button`
    width: 402px;
    height: 48px;
    border-radius: 10px;
    border: 0px;
    font-size: 20px;
    cursor: pointer;
    ${(props) => {
        if (props.disabled) {
            return css`
                background-color: var(--light-gray);
            `;
        }
        return css`
            background-color: var(--main-button-color);
            color: white;
        `;
    }}
`;

const StStartText = styled.div`
    text-align: center;
    margin-top: 43px;
    user-select: none;
`;

const StExternalLoginWrap = styled.div`
    width: 106px;
    height: 42px;
    margin: 18px auto;
    display: flex;
    gap: 30px;
`;

const StKakaoLogin = styled.button`
    width: 42px;
    height: 42px;
    border-radius: 50%;
    border: 0px;
    cursor: pointer;
    background-color: white;
`;

const StKakaoImg = styled.img`
    width: 42px;
    height: 42px;
`;
