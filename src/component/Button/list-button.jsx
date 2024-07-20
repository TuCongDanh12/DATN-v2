import React from 'react'
import {Flex} from 'antd'
import ButtonExit from './button-exit'
import ButtonConfirm from './button-confirm'

function ListButton() {
  return (
    <Flex gap={5}>
        <ButtonExit/>
        <ButtonConfirm/>
    </Flex>
  )
}

export default ListButton