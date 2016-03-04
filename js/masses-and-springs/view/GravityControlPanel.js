// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  var customString = require( 'string!MASSES_AND_SPRINGS/custom' );
  var zeroGString = require( 'string!MASSES_AND_SPRINGS/zeroG' );
  var earthString = require( 'string!MASSES_AND_SPRINGS/earth' );
  var jupiterString = require( 'string!MASSES_AND_SPRINGS/jupiter' );
  var moonString = require( 'string!MASSES_AND_SPRINGS/moon' );
  var planetXString = require( 'string!MASSES_AND_SPRINGS/planetX' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var noneString = require( 'string!MASSES_AND_SPRINGS/none' );
  var lotsString = require( 'string!MASSES_AND_SPRINGS/lots' );

  var FONT = new PhetFont( 32 );

  /**
   *
   * @param {Property} gravityProperty
   * @param {Range} gravityPropertyRange
   * @param {Node} listNodeParent
   * @param {} options
   * @constructor
   */
  function GravityControlPanel( gravityProperty, gravityPropertyRange, listNodeParent, options ) {
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 50,
      yMargin: 25
    }, options );

    var bodyListItems = [];
    bodyListItems.push( {
      node: new Text( earthString, { font: FONT } ),
      value: 9.8
    } );
    bodyListItems.push( {
      node: new Text( moonString, { font: FONT } ),
      value: 1.622
    } );
    bodyListItems.push( {
      node: new Text( jupiterString, { font: FONT } ),
      value: 24.79
    } );
    bodyListItems.push( {
      node: new Text( planetXString, { font: FONT } ),
      value: 3.7 //Mercury
    } );
    bodyListItems.push( {
      node: new Text( zeroGString, { font: FONT } ),
      value: 0
    } );
    bodyListItems.push( {
      node: new Text( customString, { font: FONT } ),
      value: null
    } );

    var gravityComboBox = new ComboBox( bodyListItems, gravityProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8
    } );

    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 20,
      trackSize: new Dimension2( 200, 5 ),
      thumbNode: new HSlider.ThumbNode( new Property( true ), {
        thumbSize: new Dimension2( 20, 40 ),
        thumbFillEnabled: '#00b3b3',
        thumbFillHighlighted: '#00e6e6'
      } )
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( noneString, { font: FONT, pickable: false } ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( lotsString, { font: FONT, pickable: false } ) );

    var gravityVBox = new VBox();
    gravityVBox.addChild( new Text( gravityString, FONT ) );
    gravityVBox.addChild( gravityComboBox );
    gravityVBox.addChild( hSlider );

    Panel.call( this, gravityVBox, options );
  }

  massesAndSprings.register( 'GravityControlPanel', GravityControlPanel );

  return inherit( Panel, GravityControlPanel );

} );
