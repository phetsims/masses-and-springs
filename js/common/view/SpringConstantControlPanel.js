// Copyright 2016-2017, University of Colorado Boulder

/**
 * Responsible for the panel that controls the spring constant of a spring.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  
  // strings
  var springConstantSmallString = require( 'string!MASSES_AND_SPRINGS/springConstant.small' );
  var springConstantLargeString = require( 'string!MASSES_AND_SPRINGS/springConstant.large' );

  /**
   * @param {Property.<number>} springConstantProperty
   * @param {Range} springConstantPropertyRange
   * @param {string} title
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function SpringConstantControlPanel( springConstantProperty, springConstantPropertyRange, title, tandem, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5,
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      tandem: tandem
    }, options );

    var hSlider = new HSlider( springConstantProperty, springConstantPropertyRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      trackSize: new Dimension2( 120, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6',
      align: 'center',
      tandem: tandem.createTandem( 'hSlider' )
    } );

    hSlider.addMajorTick( springConstantPropertyRange.min, new Text( springConstantSmallString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'springConstantSmallString' )
    } ) );
    hSlider.addMajorTick( springConstantPropertyRange.min
                          + ( springConstantPropertyRange.max - springConstantPropertyRange.min ) / 2 );
    hSlider.addMajorTick( springConstantPropertyRange.max, new Text( springConstantLargeString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'springConstantLargeString' )
    } ) );
    for ( var i = 1; i < 10; i++ ) {
      if ( i !== 5 ) {
        hSlider.addMinorTick( springConstantPropertyRange.min +
                              i * ( springConstantPropertyRange.max - springConstantPropertyRange.min ) / 10 );
      }
    }

    Panel.call( this, new VBox( {
      align: 'left',
      children: [
        new Text( title, {
          font: MassesAndSpringsConstants.TITLE_FONT,
          tandem: tandem.createTandem( 'title' )
        } ),
        hSlider
      ],
      tandem: tandem.createTandem( 'vBox' )
    } ), options );
  }

  massesAndSprings.register( 'SpringConstantControlPanel', SpringConstantControlPanel );

  return inherit( Panel, SpringConstantControlPanel );

} );
