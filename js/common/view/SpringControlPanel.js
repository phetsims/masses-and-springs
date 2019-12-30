// Copyright 2016-2019, University of Colorado Boulder

/**
 * Panel responsible for adjusting the a Property of the spring using an hslider.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Dimension2 = require( 'DOT/Dimension2' );
  const HSlider = require( 'SUN/HSlider' );
  const inherit = require( 'PHET_CORE/inherit' );
  const massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  const MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  const merge = require( 'PHET_CORE/merge' );
  const Panel = require( 'SUN/Panel' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Utils = require( 'DOT/Utils' );
  const VBox = require( 'SCENERY/nodes/VBox' );

  /**
   * @param {Property.<number>} springProperty - Property to be adjusted by hSlider
   * @param {Range} propertyRange - range of values for length
   * @param {string} title - string used to title the panel
   * @param {Array.<Text>} labels - formatted as: [ minLabel, maxLabel]
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringControlPanel( springProperty, propertyRange, title, labels, tandem, options ) {
    options = merge( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      titleFont: MassesAndSpringsConstants.TITLE_FONT,
      xMargin: 5,
      yMargin: 5,
      spacing: 3,
      minWidth: 165,
      align: 'center',
      centerTick: false,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      visible: false,
      sliderIndent: 0,
      minorTickMarksVisible: true,
      sliderTrackSize: new Dimension2( 120, 0.1 ),
      tickLabelSpacing: 6,
      constrainValue: Utils.roundSymmetric( springProperty.value )
    }, options );

    const hSliderTitle = new Text( title, { font: options.titleFont, maxWidth:150 } );

    // slider used to adjust value of property attributed to the spring
    const hSlider = new HSlider( springProperty, propertyRange, {
      top: hSliderTitle.bottom+ 20,
      majorTickLength: 10,
      minorTickLength: 5,
      minorTickLineWidth: 0.5,
      tickLabelSpacing: options.tickLabelSpacing,
      trackSize: options.sliderTrackSize,
      thumbSize: new Dimension2( 13, 22 ),
      thumbFill: '#00C4DF',
      thumbFillHighlighted: MassesAndSpringsConstants.THUMB_HIGHLIGHT,
      align: 'center',
      constrainValue: options.constrainValue,
      tandem: tandem.createTandem( 'hSlider' )
    } );
    hSliderTitle.centerX = hSlider.centerX ;

    if ( options.centerTick ) {
      hSlider.addMajorTick( propertyRange.min, labels[ 0 ] );
      hSlider.addMajorTick( propertyRange.min + ( propertyRange.max - propertyRange.min ) / 2 );
      hSlider.addMajorTick( propertyRange.max, labels[ 1 ] );
      for ( var i = 1; i < 10; i++ ) {
        if ( i !== 5 && options.minorTickMarksVisible ) {
          hSlider.addMinorTick( propertyRange.min + i * ( propertyRange.max - propertyRange.min ) / 10 );
        }
      }
    }
    else {
      hSlider.addMajorTick( propertyRange.min, labels[ 0 ] );
      hSlider.addMajorTick( propertyRange.max, labels[ 1 ] );
      for ( i = 1; i < 10; i++ ) {
        hSlider.addMinorTick( propertyRange.min + i * ( propertyRange.max - propertyRange.min ) / 9 );
      }
    }

    Panel.call( this, new VBox( {
      align:'center',
      spacing:options.spacing,
      children: [
        hSliderTitle,
        hSlider
      ]
    } ), options );
  }

  massesAndSprings.register( 'SpringControlPanel', SpringControlPanel );

  return inherit( Panel, SpringControlPanel );
} );
