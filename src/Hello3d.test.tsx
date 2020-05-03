import Adapter from 'enzyme-adapter-react-16';
import React from 'react'
import Enzyme, { mount, ReactWrapper } from 'enzyme'
import Hello3d from './Hello3d';
Enzyme.configure({ adapter: new Adapter() });
describe("Hello3d", ()=>{
    it("can be tested", ()=>{
        const wrapper = mount(<Hello3d/>);
        expect(wrapper.length).toBe(1)
    })
})