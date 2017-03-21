// Copyright 2016-2017, University of Colorado Boulder

/**
 * Node for the gravity control panel and combo box for planet gravity options.
 *
 * @author Matt Pennington (PhET Interactive Simulations)
 * @author Denzell Barnett (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var massesAndSprings = require( 'MASSES_AND_SPRINGS/massesAndSprings' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HSlider = require( 'SUN/HSlider' );
  var Range = require( 'DOT/Range' );
  var Panel = require( 'SUN/Panel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityNoneString = require( 'string!MASSES_AND_SPRINGS/gravity.none' );
  var gravityLotsString = require( 'string!MASSES_AND_SPRINGS/gravity.lots' );
  var TText = require( 'SCENERY/nodes/TText' );

  // phet-io modules
  var TString = require( 'ifphetio!PHET_IO/types/TString' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   *
   * @param {Property,<number>} gravityProperty
   * @param {Range} gravityPropertyRange
   * @param {[Body]} bodies
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityControlPanel( gravityProperty, gravityPropertyRange, bodyTitleProperty, bodies, listNodeParent, tandem, options ) {
    var self = this;
    options = _.extend( {
      fill: 'rgb( 240, 240, 240 )',
      xMargin: 13,
      yMargin: 10,
      align: 'left',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    this.bodies = bodies;
    bodies.forEach( function( body ) {
      var bodyLabel = new Text( body.title, {
        font: MassesAndSpringsConstants.LABEL_FONT,
        tandem: tandem.createTandem( 'bodyLabel' ),
        phetioValueType: TText
      } );
      bodyLabel.localBounds = bodyLabel.localBounds.withMaxX( Math.max( 50, bodyLabel.localBounds.maxX ) );

      bodyListItems.push( {
        node: bodyLabel,
        value: body.title
      } );
    } );
    // @public {Property.<number>}
    this.gravityProperty = gravityProperty;

    // @public {Property.<string>}
    this.bodyTitleProperty = bodyTitleProperty;

    // {Property.<number>}
    var previousGravityProperty = new Property( Body.EARTH.gravity, {
      tandem: tandem.createTandem( 'previousGravityProperty' ),
      phetioValueType: TNumber( {
        units: 'meters/second/second',
        range: new Range( 0, 30 )
      } )
    } );

    // @private {Property.<string>}
    // TODO: the selected body should be in the model, not the control panel.  Probably in MassesAndSpringsModel.
    // TODO: consider making this a Property.<Body> instead of of Propery.<string

    // @public {Property.<string>}
    var previousBodyTitleProperty = new Property( Body.EARTH.title, {
      tandem: tandem.createTandem( 'previousBodyTitleProperty' ),
      phetioValueType: TString
    } );

    var gravityComboBox = new ComboBox( bodyListItems, bodyTitleProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 8,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    // Saving a reference to toggle visibility for Planet X
    this.hSlider = new HSlider( gravityProperty, gravityPropertyRange, {
      majorTickLength: 10,
      trackSize: new Dimension2( 130, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6',
      tandem: tandem.createTandem( 'gravityPropertyHSlider' )
    } );
    this.hSlider.addMajorTick( gravityPropertyRange.min, new Text( gravityNoneString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityNoneString' )
    } ) );
    this.hSlider.addMajorTick( gravityPropertyRange.max, new Text( gravityLotsString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityLotsString' )
    } ) );

    Panel.call( this, new VBox( {
      align: 'left',
      children: [
        new Text( gravityString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
        gravityComboBox,
        self.hSlider
      ],
      tandem: tandem.createTandem( 'gravityPropertyVBox' )
    } ), options );

    bodyTitleProperty.link( function( newBodyTitle ) {
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
      else if ( previousBodyTitleProperty.get() === Body.PLANET_X.title && newBodyTitle === Body.CUSTOM.title ) {
        self.gravityProperty.set( previousGravityProperty.get() );
      }
      // Update gravity
      else if ( body.gravity || body.title === Body.ZERO_G.title ) {
        self.gravityProperty.set( body.gravity );
      }

      //Store previous state so we can revert after leaving Planet X.
      previousBodyTitleProperty.set( newBodyTitle );
    } );

    this.gravityProperty.link( function( newGravity ) {
      // Remember the last change to gravity if we are not on planetX
      if ( bodyTitleProperty.get() !== Body.PLANET_X.title ) {
        previousGravityProperty.set( newGravity );
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
      bodyTitleProperty.set( Body.CUSTOM.title );
    } );
    this.mutate( options );
  }

  massesAndSprings.register( 'GravityControlPanel', GravityControlPanel );

  return inherit( Panel, GravityControlPanel, {

    /**
     * @public
     */
    reset: function() {
      // On reset we need to manually set title to Earth or the gravityLink will change it to custom.
      this.bodyTitleProperty.set( Body.EARTH.title );
    }
  } );

} );