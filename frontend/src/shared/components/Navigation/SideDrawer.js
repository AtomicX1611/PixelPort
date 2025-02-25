import React, { useRef } from "react";
import ReactDom from "react-dom";
import "./SideDrawer.css";
import { CSSTransition } from "react-transition-group";

const SideDrawer = (props) => {
  const nodeRef = useRef(null);

  const sideDrawer = (
    <CSSTransition
      in={props.show}
      timeout={20}
      mountOnEnter
      unmountOnExit
      classNames="slide-in-left"
      nodeRef={nodeRef}
    >
      <aside className="side-drawer" ref={nodeRef} onClick={props.close}>
        {props.children}
      </aside>
    </CSSTransition>
  );
  return ReactDom.createPortal(sideDrawer, document.getElementById("drawer"));
};

export default SideDrawer;
