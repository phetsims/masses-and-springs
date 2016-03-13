// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  var Body = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Body' );

  var ComboBox = require( 'SUN/ComboBox' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Property = require( 'AXON/Property' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  //var bodyCustomString = require( 'string!MASSES_AND_SPRINGS/body.custom' );
  //var bodyZeroGString = require( 'string!MASSES_AND_SPRINGS/body.zeroG' );
  //var bodyEarthString = require( 'string!MASSES_AND_SPRINGS/body.earth' );
  //var bodyJupiterString = require( 'string!MASSES_AND_SPRINGS/body.jupiter' );
  //var bodyMoonString = require( 'string!MASSES_AND_SPRINGS/body.moon' );
  //var bodyPlanetXString = require( 'string!MASSES_AND_SPRINGS/body.planetX' );
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityNoneString = require( 'string!MASSES_AND_SPRINGS/gravity.none' );
  var gravityLotsString = require( 'string!MASSES_AND_SPRINGS/gravity.lots' );

  var LABEL_FONT = new PhetFont( 12 );
  var TITLE_FONT = new PhetFont( { size: 12, weight: 'bold' } );

  /**
   *
   * @param {Property,<number>} gravityProperty
   * @param {Range} gravityPropertyRange
   * @param {[Body]} bodies
   * @param {Node} listNodeParent
   * @param {} [options]
   *
   * @constructor
   */
  function GravityControlPanel( gravityProperty, gravityPropertyRange, bodies, listNodeParent, options ) {
    var self = this;
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 16,
      yMargin: 10,
      align: 'left'
    }, options );

    var bodyListItems = [];
    this.bodies = bodies;
    bodies.forEach( function( body ) {
      var bodyLabel = new Text( body.title, { font: LABEL_FONT } );
      //bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body.title
      } );
    } );

    this.gravityProperty = gravityProperty;
    Property.addProperty( this, 'bodyTitle', Body.EARTH.title );

    this.bodyTitleProperty.link( function( newBodyTitle ) {
      var body = _.find( self.bodies, { title: newBodyTitle } );
      if ( body.gravity || body.title === Body.ZERO_G.title ) {
        self.gravityProperty.set( body.gravity );
      }
    } );

    this.gravityProperty.link( function( newGravity ) {
      for ( var i in self.bodies ){
        if ( self.bodies[ i ] && self.bodies[ i ].gravity && newGravity === self.bodies[ i ].gravity ) {
          return;
        }
      }
      self.bodyTitle = Body.CUSTOM.title;
    } );
    var gravityComboBox = new ComboBox( bodyListItems, self.bodyTitleProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8
    } );

    var hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: new Dimension2( 150, 2 ),
      thumbNode: new HSlider.ThumbNode( new Property( true ), {
        thumbSize: new Dimension2( 7.5, 15 ),
        thumbFillEnabled: '#00b3b3',
        thumbFillHighlighted: '#00e6e6'
      } )
    } );
    hSlider.addMajorTick( gravityPropertyRange.min, new Text( gravityNoneString, { font: LABEL_FONT } ) );
    hSlider.addMajorTick( gravityPropertyRange.max, new Text( gravityLotsString, { font: LABEL_FONT } ) );

    Panel.call( this, new VBox( {
      align: 'left',
      children: [
        new Text( gravityString, TITLE_FONT ),
        gravityComboBox,
        hSlider
      ]
    }), options );
  }

  massesAndSprings.register( 'GravityControlPanel', GravityControlPanel );

  return inherit( Panel, GravityControlPanel );

} );
