import * as React from 'react';
import {create} from 'react-test-renderer';
import {MediaMatcher, MediaMock, pickMatch, MediaServerRender} from '../src';

describe('Specs', () => {
  it('should render mobile', () => {
    const wrapper =
      create(
        <MediaMock mobile>
          <MediaMatcher mobile="1" tablet="2" desktop="3"/>
        </MediaMock>
      );
    expect(wrapper.toJSON()).toEqual("1");
  });

  it('should render tablet', () => {
    const wrapper =
      create(
        <MediaMock tablet>
          <MediaMatcher mobile="1" tablet="2" desktop="3"/>
        </MediaMock>
      );
    expect(wrapper.toJSON()).toEqual("2");
  });

  it('should render desktop', () => {
    const wrapper =
      create(
        <MediaMock desktop>
          <MediaMatcher mobile="1" tablet="2" desktop="3"/>
        </MediaMock>
      );
    expect(wrapper.toJSON()).toEqual("3");
  });

  it('should render tablet for desktop if it is not set', () => {
    const wrapper =
      create(
        <MediaMock desktop>
          <MediaMatcher mobile="1" tablet="2"/>
        </MediaMock>
      );
    expect(wrapper.toJSON()).toEqual("2");
  });

  it('should render mobile for desktop if it is not set', () => {
    const wrapper =
      create(
        <MediaMock tablet>
          <MediaMatcher mobile="1" desktop="2"/>
        </MediaMock>
      );
    expect(wrapper.toJSON()).toEqual("1");
  });

  it('pickMatch', () => {
    expect(pickMatch({
      mobile: false,
      tablet: true,
      desktop: false,
    }, {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    })).toBe(2);

    expect(pickMatch({
      mobile: false,
      tablet: true,
      desktop: false,
    }, {
      mobile: 1,
      desktop: 3,
    })).toBe(1);

    expect(pickMatch({
      mobile: true,
      tablet: false,
      desktop: false,
    }, {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    })).toBe(1);
  })


  describe('SSR', () => {
    it('Render', () => {
      const wrapper =
        create(
          <MediaServerRender predicted="tablet">
            <MediaMatcher mobile="1" tablet="2" desktop="3"/>
          </MediaServerRender>
        );
      expect(wrapper.toJSON()).toEqual("2");
    });

    it('Render:positive', () => {
      jest.spyOn(console, 'error');
      const wrapper =
        create(
          <MediaMock tablet>
          <MediaServerRender predicted="tablet">
            <MediaMatcher mobile="1" tablet="2" desktop="3"/>
          </MediaServerRender>
          </MediaMock>
        );
      expect(wrapper.toJSON()).toEqual("2");
      expect(console.error).not.toHaveBeenCalled();
    });

    it.skip('Render:negative', () => {
      jest.spyOn(console, 'error');
      const wrapper =
        create(
          <MediaMock desktop>
            <MediaServerRender predicted="tablet">
              <MediaMatcher mobile="1" tablet="2" desktop="3"/>
            </MediaServerRender>
          </MediaMock>
        );
      expect(wrapper.toJSON()).toEqual("2");
      expect(console.error).toHaveBeenCalled();
    });
  })
});
