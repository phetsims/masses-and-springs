// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var springConstantSmallString = require( 'string!MASSES_AND_SPRINGS/springConstant.small' );
  var springConstantLargeString = require( 'string!MASSES_AND_SPRINGS/springConstant.large' );
  var LABEL_FONT = new PhetFont( 10 );
  var TITLE_FONT = new PhetFont( { size: 12, weight: 'bold', align: 'left' } );

  /**
   *
   * @param {Property,<number>} springConstantProperty
   * @param {Range} springConstantPropertyRange
   * @param {string} title
   * @param {Object} options
   * @constructor
   */
  function SpringConstantControlPanel( springConstantProperty, springConstantPropertyRange, title, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 5,
      yMargin: 5
    }, options );

    var hSlider = new HSlider( springConstantProperty, springConstantPropertyRange, {
      majorTickLength: 10,
      minorTickLength: 5,
      trackSize: new Dimension2( 120, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6'
    } );

    hSlider.addMajorTick( springConstantPropertyRange.min, new Text( springConstantSmallString, { font: LABEL_FONT } ) );
    hSlider.addMajorTick( springConstantPropertyRange.min + ( springConstantPropertyRange.max - springConstantPropertyRange.min ) / 2 );
    hSlider.addMajorTick( springConstantPropertyRange.max, new Text( springConstantLargeString, { font: LABEL_FONT } ) );
    for ( var i = 1; i < 10; i++ ) {
      if ( i !== 5 ) {
        hSlider.addMinorTick( springConstantPropertyRange.min + i * ( springConstantPropertyRange.max - springConstantPropertyRange.min ) / 10 );
      }
    }

    Panel.call( this, new VBox( {
      align: 'left',
      children: [
        new Text( title, { font: TITLE_FONT } ),
        hSlider
      ]
    } ), options );
  }

  massesAndSprings.register( 'SpringConstantControlPanel', SpringConstantControlPanel );

  return inherit( Panel, SpringConstantControlPanel );

} );
