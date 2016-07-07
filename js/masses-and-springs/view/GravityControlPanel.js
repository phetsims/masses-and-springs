// Copyright 2016, University of Colorado Boulder

/**
 * @author Matt Pennington
 */
define( function( require ) {
  'use strict';

  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );

  //modules
  var Property = require( 'AXON/Property' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Body = require( 'MASSES_AND_SPRINGS/masses-and-springs/model/Body' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );

  // strings
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

    //  Add gravity info for various planets
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

    this.gravityProperty = gravityProperty; // {number}
    Property.addProperty( this, 'bodyTitle', Body.EARTH.title ); // {string}
    Property.addProperty( this, 'previousBodyTitle', Body.EARTH.title ); // {string}
    Property.addProperty( this, 'previousGravity', Body.EARTH.gravity ); // {number}

    var gravityComboBox = new ComboBox( bodyListItems, self.bodyTitleProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8
    } );

    // Saving a reference to toggle visibility for Planet X
    this.hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: new Dimension2( 150, 2 ),
      thumbSize: new Dimension2( 7.5, 15 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6'
    } );
    this.hSlider.addMajorTick( gravityPropertyRange.min, new Text( gravityNoneString, { font: LABEL_FONT } ) );
    this.hSlider.addMajorTick( gravityPropertyRange.max, new Text( gravityLotsString, { font: LABEL_FONT } ) );

    Panel.call( this, new VBox( {
      align: 'left',
      children: [
        new Text( gravityString, TITLE_FONT ),
        gravityComboBox,
        self.hSlider
      ]
    } ), options );

    this.bodyTitleProperty.link( function( newBodyTitle ) {
      var body = _.find( self.bodies, { title: newBodyTitle } );

      // Unhide the hSlider if we are not using planetX
      if ( newBodyTitle !== Body.PLANET_X.title ) {
        self.hSlider.visible = true;
      }

      //  If PlanetX hide the slider and update gravity
      if ( newBodyTitle === Body.PLANET_X.title ) {
        self.hSlider.visible = false;
        self.gravityProperty.set( body.gravity );
      }
      //  If we switched from PlanetX to Custom, display the last known non-planetX gravity.
      else if ( self.previousBodyTitle === Body.PLANET_X.title && newBodyTitle === Body.CUSTOM.title ) {
        self.gravityProperty.set( self.previousGravity );
      }
      // Update gravity
      else if ( body.gravity || body.title === Body.ZERO_G.title ) {
        self.gravityProperty.set( body.gravity );
      }

      //Store previous state so we can revert after leaving Planet X.
      self.previousBodyTitle = newBodyTitle;
    } );

    this.gravityProperty.link( function( newGravity ) {
      // Remember the last change to gravity if we are not on planetX
      if ( self.bodyTitle !== Body.PLANET_X.title ) {
        self.previousGravity = newGravity;
      }
      // If we changed to a body, don't try to update the title
      for ( var i in self.bodies ) {
        // We can't check for truthiness of self.bodies[ i ].gravity because ZeroG is not truthy
        if ( self.bodies[ i ] && self.bodies[ i ].hasOwnProperty( 'gravity' ) &&
             newGravity === self.bodies[ i ].gravity ) {
          return;
        }
      }
      //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
      self.bodyTitle = Body.CUSTOM.title;
    } );
  }

  massesAndSprings.register( 'GravityControlPanel', GravityControlPanel );

  return inherit( Panel, GravityControlPanel, {

    /**
     * @public
     */
    reset: function() {
      // On reset we need to manually set title to Earth or the gravityLink will change it to custom.
      this.bodyTitle = Body.EARTH.title;
    }
  } );

} );
