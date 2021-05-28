import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import LayerSelector from './LayerSelector';
import MenuContainer from './MenuContainer';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import './ArcgisMap.less';
import { loadModules, loadCss } from 'esri-loader';
import { getTheme } from '../utils';
let view;
function ArcgisMap({
  id,
  theme = 'default-light',
  customClass = null,
  extraMenu = null,
}) {
  const mapDiv = useRef(null);

  let mapClass = classNames('map-container', {
    [`${customClass}`]: customClass,
  });
  useEffect(() => {
    if (theme === 'default-light') {
      loadCss();
    } else {
      loadCss(getTheme(theme));
    }
    loadMap();

    async function loadMap() {
      loadModules([
        'esri/WebMap',
        'esri/views/MapView',
        'esri/widgets/BasemapGallery',
        'esri/widgets/Zoom',
        'esri/widgets/ScaleBar',
      ]).then(([Map, MapView, BasemapGallery, Zoom, ScaleBar]) => {
        if (mapDiv.current) {
          const map = new Map({
            basemap: 'topo-vector',
            slider: false,
          });
          view = new MapView({
            container: mapDiv.current,
            map: map,
            center: [15, 50],
            zoom: 3,
            ui: {
              components: ['attribution'], // removes default widgets except for attribution
            },
          });
          if (view) {
            view.constraints = {
              minZoom: 3,
            };
            var zoom = new Zoom({
              view: view,
            });
            view.ui.add(zoom, {
              position: 'top-right',
            });

            // LAYER SELECTOR
            const baseMapNode = document.createElement('div');
            baseMapNode.className = 'basemap-gallery-container';
            // Parse React Component to DOM
            ReactDOM.render(<LayerSelector id={id} />, baseMapNode);
            view.ui.add(baseMapNode, 'top-right');

            const basemapGallery = new BasemapGallery({
              view: view,
            });
            view.ui.add(basemapGallery, 'top-right');

            // Print
            var print_button = document.createElement('div');
            print_button.className =
              'esri-icon-printer esri-widget--button esri-widget esri-interactive';
            print_button.setAttribute('role', 'button');
            print_button.setAttribute('title', 'Print');
            print_button.addEventListener('click', function (evt) {
              // action
            });
            view.ui.add(print_button, 'top-right');

            // Area selection
            var area_button = document.createElement('div');
            area_button.className =
              'esri-icon-cursor-marquee esri-widget--button esri-widget esri-interactive';
            area_button.setAttribute('role', 'button');
            area_button.setAttribute('title', 'Select area');
            area_button.addEventListener('click', function (evt) {
              // action
            });
            view.ui.add(area_button, 'top-right');

            // Legend
            var legend_button = document.createElement('div');
            legend_button.className =
              'esri-icon-legend esri-widget--button esri-widget esri-interactive';
            legend_button.setAttribute('role', 'button');
            legend_button.setAttribute('title', 'Legend');
            legend_button.addEventListener('click', function (evt) {
              // action
            });
            view.ui.add(legend_button, 'top-right');

            // Menu
            if (extraMenu) {
              const menuContainerNode = document.createElement('div');
              menuContainerNode.className = 'map-left-menu-container';
              // Parse React Component to DOM
              ReactDOM.render(
                <MenuContainer>{extraMenu}</MenuContainer>,
                menuContainerNode,
              );
              view.ui.add(menuContainerNode, 'top-left');
            }

            // loadTestProducts();

            // Scalebar
            var scaleBar = new ScaleBar({
              view: view,
              unit: 'dual',
            });
            view.ui.add(scaleBar, 'bottom-left');

            // Loading icon
            view.watch('updating', function (evt) {
              if (document.getElementById(id)) {
                if (evt === true) {
                  document
                    .getElementById(id)
                    .querySelector('.loading').style.display = 'flex';
                } else {
                  document
                    .getElementById(id)
                    .querySelector('.loading').style.display = 'none';
                }
              }
            });
          }
        }
      });
    }
  }, [theme, customClass, id, extraMenu]);

  return (
    <>
      <div className={mapClass} id={id}>
        <div ref={mapDiv} className="map"></div>
        <div className="loading">
          {' '}
          <FontAwesomeIcon icon={faSpinner} pulse />
        </div>
      </div>
    </>
  );
}

export default ArcgisMap;
