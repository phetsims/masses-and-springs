// Copyright 2016-2018, University of Colorado Boulder

/**
 * Panel responsible for adjusting the a Property of the spring using an hslider.
 *
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var inherit = require( 'PHET_CORE/inherit' );
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Panel = require( 'SUN/Panel' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HStrut = require( 'SCENERY/nodes/HStrut' );

  /**
   * @param {Property.<number>} springProperty - Property to be adjusted by hSlider
   * @param {Range} propertyRange - range of values for length
   * @param {string} title - string used to title the panel
   * @param {array.<Text>} labels - formatted as: [ minLabel, maxLabel]
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringControlPanel( springProperty, propertyRange, title, labels, tandem, options ) {
    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      titleFont: MassesAndSpringsConstants.TITLE_FONT,
      xMargin: 5,
      yMargin: 5,
      align: 'center',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      stroke: 'black',
      visible: false,
      sliderIndent: 0,
      minorTickMarksVisible: true,
      constrainValue: function( value ) {
        return Util.roundSymmetric( value );
      },
    }, options );

    // slider used to adjust value of natural resting length of spring
    var hSlider = new HSlider( springProperty, propertyRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      minorTickLineWidth: 0.5,
      trackSize: new Dimension2( 120, 0.1 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00C4DF',
      thumbFillHighlighted: '#71EDFF',
      align: 'center',
      constrainValue: options.constrainValue,
      tandem: tandem.createTandem( 'hSlider' )
    } );

    hSlider.addMajorTick( propertyRange.min, labels[ 0 ] );
    hSlider.addMajorTick( propertyRange.min + ( propertyRange.max - propertyRange.min ) / 2 );
    hSlider.addMajorTick( propertyRange.max, labels[ 1 ] );
    for ( var i = 1; i < 10; i++ ) {
      if ( i !== 5 && options.minorTickMarksVisible ) {
        hSlider.addMinorTick( propertyRange.min + i * ( propertyRange.max - propertyRange.min ) / 10 );
      }
    }
    var hSliderTitle = new Text( title, { font: options.titleFont } );

    Panel.call( this, new VBox( {
      align: options.align,
      spacing: 5,
      children: [
        hSliderTitle,
        new HBox( { children: [ new HStrut( options.sliderIndent ), hSlider ] } )
      ]
    } ), options );

  }

  massesAndSprings.register( 'SpringControlPanel', SpringControlPanel );

  return inherit( Panel, SpringControlPanel );

} );
