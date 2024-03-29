import { createGlobalStyle } from 'styled-components';

const GlobalColor = createGlobalStyle`
    :root {
        --main-button-color: #756ab6;
        --content-border-color: #ededed;
        --button-border-color: #abaad8;
        --hr-border-color: #ececec;
        --box-border-color: #d3d3d3;
        --background-color: #fcfcfc;
        --light-purple: #ac87c5;
        --light-pink: #e0aed0;
        --light-beige: #ffe5e5;
        --bold-gray: #73777B;
        --light-gray: #F8F8F8;
        --placeholder-color: #969696;
        --search-background-color: #f5f5f5
    }
`;

export default GlobalColor;
