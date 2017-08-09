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
  var Dimension2 = require( 'DOT/Dimension2' );
  var Body = require( 'MASSES_AND_SPRINGS/common/model/Body' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var ComboBox = require( 'SUN/ComboBox' );
  var HSlider = require( 'SUN/HSlider' );
  var Panel = require( 'SUN/Panel' );
  var MassesAndSpringsConstants = require( 'MASSES_AND_SPRINGS/common/MassesAndSpringsConstants' );

  // strings
  var gravityString = require( 'string!MASSES_AND_SPRINGS/gravity' );
  var gravityNoneString = require( 'string!MASSES_AND_SPRINGS/gravity.none' );
  var gravityLotsString = require( 'string!MASSES_AND_SPRINGS/gravity.lots' );
  var frictionString = require( 'string!MASSES_AND_SPRINGS/friction' );

  // phet-io modules
  var TText = require( 'SCENERY/nodes/TText' );

  /**
   * @param {MassesAndSpringsModel} model
   * @param {Node} listNodeParent
   * @param {Tandem} tandem
   * @param {Object} [options]
   *
   * @constructor
   */
  function GravityAndFrictionControlPanel( model, listNodeParent, tandem, options ) {
    var self = this;
    options = _.extend( {
      fill: MassesAndSpringsConstants.PANEL_FILL,
      xMargin: 13,
      yMargin: 10,
      align: 'left',
      cornerRadius: MassesAndSpringsConstants.PANEL_CORNER_RADIUS,
      frictionVisible: false
    }, options );

    //  Add gravity info for various planets
    var bodyListItems = [];
    this.bodies = model.bodies;
    model.bodies.forEach( function( body ) {
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

    // @public
    this.gravityProperty = model.gravityProperty;

    // @public
    this.bodyTitleProperty = model.bodyTitleProperty;
    var previousGravityProperty = Body.EARTH.gravity;
    var previousBodyTitle = Body.EARTH.title;

    // @private {read-only} manages the items associated with the gravity panel in a combo box
    var gravityComboBox = new ComboBox( bodyListItems, model.bodyTitleProperty, listNodeParent, {
      listPosition: 'below',
      buttonCornerRadius: 5,
      buttonYMargin: 0,
      itemYMargin: 3,
      listYMargin: 0,
      tandem: tandem.createTandem( 'gravityComboBox' )
    } );

    // @private {read-only} manages the values associated with the gravity panel in a combo box
    var gravityHSlider = new HSlider( model.gravityProperty, MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get(), {
      majorTickLength: 10,
      trackSize: new Dimension2( 130, 2 ),
      thumbSize: new Dimension2( 13, 22 ),
      thumbFillEnabled: '#00b3b3',
      thumbFillHighlighted: '#00e6e6',
      tandem: tandem.createTandem( 'gravityPropertyHSlider' )
    } );
    gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().min, new Text( gravityNoneString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityNoneString' )
    } ) );
    gravityHSlider.addMajorTick( MassesAndSpringsConstants.GRAVITY_RANGE_PROPERTY.get().max, new Text( gravityLotsString, {
      font: MassesAndSpringsConstants.LABEL_FONT,
      tandem: tandem.createTandem( 'gravityLotsString' )
    } ) );

    if ( options.frictionVisible ) {
      this.frictionHSlider = new HSlider( model.frictionProperty, MassesAndSpringsConstants.FRICTION_RANGE_PROPERTY.get(), {
        majorTickLength: 10,
        trackSize: new Dimension2( 130, 2 ),
        thumbSize: new Dimension2( 13, 22 ),
        thumbFillEnabled: '#00b3b3',
        thumbFillHighlighted: '#00e6e6',
        tandem: tandem.createTandem( 'gravityPropertyHSlider' )
      } );
      Panel.call( this, new VBox( {
        align: 'left',
        children: [
          new Text( gravityString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          gravityComboBox,
          gravityHSlider,
          new Text( frictionString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          this.frictionHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } ), options );
    }
    else {
      Panel.call( this, new VBox( {
        align: 'left',
        children: [
          new Text( gravityString, { font: MassesAndSpringsConstants.TITLE_FONT } ),
          gravityComboBox,
          gravityHSlider
        ],
        tandem: tandem.createTandem( 'gravityPropertyVBox' )
      } ), options );
    }

    // REVIEW: I (jbphet) mentioned this in MassesAndSpringsModel, but just to reiterate - it would make a lot more
    // sense to me if it was the BODY that was being selected, and not the title.
    // REVIEW: There is a second parameter available to the callback function that is the previous value - this could
    // be used instead of having to track the previous value, and only the previous gravity setting would need to be
    // tracked.
    model.bodyTitleProperty.link( function( newBodyTitle ) {
      var body = _.find( self.bodies, { title: newBodyTitle } );

      // Unhide the gravityHSlider if we are not using planetX
      if ( newBodyTitle !== Body.PLANET_X.title ) {
        gravityHSlider.visible = true;
      }

      // If PlanetX hide the slider and update gravity
      if ( newBodyTitle === Body.PLANET_X.title ) {
        gravityHSlider.visible = false;
        self.gravityProperty.set( body.gravity );
      }

      //  If we switched from PlanetX to Custom, display the last known non-planetX gravity.
      else if ( previousBodyTitle === Body.PLANET_X.title && newBodyTitle === Body.CUSTOM.title ) {
        self.gravityProperty = previousGravityProperty.get();
      }

      // Update gravity
      // REVIEW: Why is this qualified? Why not just save the value every time?
      else if ( body.gravity || body.title === Body.ZERO_G.title ) {
        self.gravityProperty.set( body.gravity );
      }

      // Store previous state so we can revert after leaving Planet X.
      previousBodyTitle = newBodyTitle;
    } );

    this.gravityProperty.link( function( newGravity ) {

      // Remember the last change to gravity if we are not on planetX
      if ( model.bodyTitleProperty.get() !== Body.PLANET_X.title ) {
        previousGravityProperty = newGravity;
      }

      // If we changed to a body, don't try to update the title
      // REVIEW: Suggest using forEach instead - IntelliJ is flagging the i variable as not checked for hasOwnProperty
      for ( var i in self.bodies ) {

        // We can't check for truthiness of self.bodies[ i ].gravity because ZeroG is not truthy
        if ( self.bodies[ i ] && self.bodies[ i ].hasOwnProperty( 'gravity' ) &&
             newGravity === self.bodies[ i ].gravity ) {
          return;
        }
      }

      //  Since the current gravity didn't match any existing bodies, the user must have set gravity manually.
      model.bodyTitleProperty.set( Body.CUSTOM.title );
    } );
    this.mutate( options );
  }

  massesAndSprings.register( 'GravityAndFrictionControlPanel', GravityAndFrictionControlPanel );

  return inherit( Panel, GravityAndFrictionControlPanel, {

    /**
     * @override
     *
     * @public
     */
    reset: function() {

      // On reset we need to manually set title to Earth or the gravityLink will change it to custom.
      // REVIEW: This doesn't make sense to me - there is an 'if' clause in gravityLink that should prevent it.  Also,
      // the reset should really be done in the model, not here.
      this.bodyTitleProperty.set( Body.EARTH.title );
    }
  } );
} );
