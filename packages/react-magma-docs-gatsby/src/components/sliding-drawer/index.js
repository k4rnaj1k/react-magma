import React from 'react';
import { css, keyframes } from '@emotion/core';
import styled from '@emotion/styled';
import FocusLock from 'react-focus-lock';
import { IconButton } from 'react-magma-dom'
import MainNav from '../main-nav'

export class SlidingDrawer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {isOpen: false};
        this.toggleButtonRef = React.createRef();
        this.closeMenu = this.closeMenu.bind(this);
        this.openMenu = this.openMenu.bind(this);
        this.handleKeypress = this.handleKeypress.bind(this);
    }   

    handleKeypress(event){
        if(event.keyCode === 27) {
            this.closeMenu();
        }
    }
      
    closeMenu = () => {
        // TODO: Put focus on menu button -- need refs set up

        document.getElementsByTagName('html')[0].style.overflow = "auto"; 
        document.removeEventListener("keydown", this.handleKeypress, false);

        this.setState({isOpen: false})
        //this.toggleButtonRef.current.focus();
    }

    openMenu = () => {
        document.getElementsByTagName('html')[0].style.overflow = "hidden";
        this.setState({isOpen: true})

        document.addEventListener("keydown", this.handleKeypress, false);
    }

    render() {
        const slidein = keyframes`
            from { transform: translateX(-280px); }
            to   { transform: translateX(0); }
        `;

        const slideout = keyframes`
            from { transform: translateX(0); }
            to   { transform: translateX(-280px); }
        `;

        const Panel = styled.div`
            animation: .2s ${slideout};
            background: #fff;
            border-right: 1px solid #DFDFDF;
            bottom: 0;
            grid-area: nav;
            min-height: 100vh;
            overflow: auto;
            position: fixed;
            top: 0;
            transform: translateX(-280px);
            width: 280px;

            ${props => props.isOpen && css`
                animation: .2s ${slidein};
                transform: translateX(0);
                z-index: 4;
            `};

            @media (min-width: 1024px) {
                animation: none;
                padding-top: 20px;
                top: 80px;
                transform: translateX(0);
            }
        `;

        const PanelInner = styled.div`
            display: ${props => (props.isOpen ? 'block' : 'none')};

            @media (min-width: 1024px) {
                display: block;
            }
        `;

        const Overlay = styled.div`
            background: rgba(0,0,0,0.6);
            bottom: 0;
            left: 0;
            position: fixed;
            right: 0;
            top: 0;
            z-index: 3;
        `;

        const MenuButton = styled.span`
            position: fixed;
            top: 0;
            left: 0;
            z-index: 3;

            @media (min-width: 600px) {
                top: 15px;
            }

            @media (min-width: 1024px) {
                display: none;
            }
        `;

        const CloseButton = styled.span`
            display: block;
            text-align: right;

            @media (min-width: 1024px) {
                display: none;
            }
        `;

        const { isOpen } = this.state;

        return (
            <FocusLock disabled={!isOpen}>
                <nav>
                    <MenuButton>
                        <IconButton
                            ariaLabel="Open navigation menu"
                            ariaExpanded={isOpen}
                            icon="menu"
                            iconOnly
                            inverse
                            onClick={this.openMenu}
                            size="large"
                            variant="link" />
                    </MenuButton>
                    <Panel isOpen={isOpen}>
                        <PanelInner isOpen={isOpen}>
                            <CloseButton>
                                <IconButton
                                    ariaLabel="Close navigation menu"
                                    color="secondary"
                                    icon="cross"
                                    iconOnly
                                    onClick={this.closeMenu}
                                    variant="link" />
                            </CloseButton>
                            <MainNav handleClick={this.closeMenu} />
                        </PanelInner>
                    </Panel>
                    {isOpen && <Overlay onClick={this.closeMenu} />}
                </nav>
            </FocusLock>
        );
    }
}