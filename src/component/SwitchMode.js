import React from 'react'
import { Button } from "@blueprintjs/core";

const SwitchMode = (props) => (
  <div>
    <Button intent="success" text="Check case" onClick={() =>
      props.callback('ONE')} />
    <Button intent="success" text="Mark bomb" onClick={() =>
      props.callback('BOMB')} />
    <Button intent="success" text="Mark suspicious" onClick={() =>
      props.callback('SUSPICIOUS')} />
    <Button intent="success" text="Check neighbours" onClick={() =>
      props.callback('ALL')} />
  </div>
)

export default SwitchMode
