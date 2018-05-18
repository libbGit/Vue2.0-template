import Vue from 'vue'
import { mount, shallow, createLocalVue } from '@vue/test-utils'
import { expect } from 'chai'  //chai的断言 assert TDD(不支持链式调用),  expect,should BDD
import VueRouter from 'vue-router'
import Vuex from 'vuex'

import AdvertiserReport from "@/views/report/index/advertiser-report"

import advertiserReportContent from "@/views/report/index/advertiser-report/advertiser-report-content";
import advertiseType from "@/views/report/index/public/sub-type/advertise-type";
import creativeData from "@/views/report/index/public/sub-type/creative-data";
import creativeGroup from "@/views/report/index/public/sub-type/creative-group";
import crowdData from "@/views/report/index/public/sub-type/crowd-data";
import dataTrend from "@/views/report/index/public/sub-type/data-trend";
import dataType from "@/views/report/index/public/sub-type/data-type";
import devicePercent from "@/views/report/index/public/sub-type/device-percent";
import mediaType from "@/views/report/index/public/sub-type/media-type";
import pointPosition from "@/views/report/index/public/sub-type/point-position";
import regionType from "@/views/report/index/public/sub-type/region-type";

import store from '@/store'

const localVue = createLocalVue()

localVue.use(Vuex)


describe('advertiser-report.vue', () => {
    beforeEach(() => { })

    it('action', () => {
        const wrapper = shallow(AdvertiserReport, {
            store,
            localVue,
            stubs: {
                'advertiser-report-content': advertiserReportContent,
                'advertise-type': advertiseType,
                'creative-data': creativeData,
                'creative-group': creativeGroup,
                'crowd-data': crowdData,
                'data-trend': dataTrend,
                'data-type': dataType,
                'device-percent': devicePercent,
                'media-type': mediaType,
                'point-position': pointPosition,
                'region-type': regionType,
            }
        });

        wrapper.vm.created();
        wrapper.vm.$nextTick(() => {
            // expect(mountWrapper.vm.value).to.be.eql(1);
            done()
        });
    })

    console.log('store===========',store);
    console.log('_actions===========',store._actions);
    console.log('store===========',store);
    // console.log('_actions===========',_actions);
    //_actions

    //_mutations

    //_modules

    //getters  _data





})